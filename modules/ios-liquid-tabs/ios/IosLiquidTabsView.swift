import ExpoModulesCore
import UIKit

/// A UIKit-only tab selector. The selection view is intentionally created once and
/// reshaped in place, so its glass material never disappears during a transition.
final class IosLiquidTabsView: ExpoView {
  private enum Metrics {
    static let height: CGFloat = 62
    static let inset: CGFloat = 5
    static let maximumStretch: CGFloat = 52
  }

  let onTabPress = EventDispatcher()

  private let glassContainer = IosLiquidTabsView.makeGlassContainer()
  private let backgroundGlass = IosLiquidTabsView.makeGlassView(interactive: false)
  private let selectionGlass = IosLiquidTabsView.makeGlassView(interactive: true)
  private let buttonsView = UIView()
  private let selectionHighlight = CAGradientLayer()
  private let selectionRim = CAShapeLayer()
  private let impactFeedback = UIImpactFeedbackGenerator(style: .light)

  private var buttons: [UIButton] = []
  private var tabs: [String] = []
  private var currentIndex = 0
  private var activeAnimator: UIViewPropertyAnimator?
  private var settleAnimator: UIViewPropertyAnimator?
  private var dragStartIndex = 0
  private var isDragging = false

  var isDark = false {
    didSet { updateAppearance() }
  }

  required init(appContext: AppContext) {
    super.init(appContext: appContext)
    backgroundColor = .clear
    clipsToBounds = false

    glassContainer.clipsToBounds = true
    glassContainer.layer.cornerRadius = Metrics.height / 2
    addSubview(glassContainer)

    glassContainer.contentView.addSubview(backgroundGlass)
    glassContainer.contentView.addSubview(selectionGlass)
    addSubview(buttonsView)

    selectionGlass.layer.masksToBounds = true
    selectionHighlight.colors = [
      UIColor.white.withAlphaComponent(0.34).cgColor,
      UIColor.white.withAlphaComponent(0.06).cgColor,
      UIColor.clear.cgColor,
    ]
    selectionHighlight.locations = [0, 0.28, 1]
    selectionHighlight.startPoint = CGPoint(x: 0.18, y: 0)
    selectionHighlight.endPoint = CGPoint(x: 0.82, y: 1)
    selectionGlass.contentView.layer.addSublayer(selectionHighlight)

    selectionRim.fillColor = UIColor.clear.cgColor
    selectionRim.strokeColor = UIColor.white.withAlphaComponent(0.55).cgColor
    selectionRim.lineWidth = 1 / UIScreen.main.scale
    selectionGlass.contentView.layer.addSublayer(selectionRim)

    let pan = UIPanGestureRecognizer(target: self, action: #selector(handlePan(_:)))
    addGestureRecognizer(pan)
    updateAppearance()
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    let controlFrame = bounds.insetBy(dx: 0, dy: max(0, (bounds.height - Metrics.height) / 2))
    glassContainer.frame = controlFrame
    buttonsView.frame = controlFrame
    backgroundGlass.frame = glassContainer.contentView.bounds
    buttons.enumerated().forEach { index, button in
      button.frame = frame(for: index) ?? .zero
    }

    if selectionGlass.frame == .zero, let frame = frame(for: currentIndex) {
      selectionGlass.frame = frame
    }

    applyCapsuleCorners()
    layoutSelectionDecoration()
  }

  func setTabs(_ newTabs: [String]) {
    guard newTabs != tabs else { return }
    tabs = newTabs
    currentIndex = min(currentIndex, max(tabs.count - 1, 0))
    buttons.forEach { $0.removeFromSuperview() }
    buttons = tabs.enumerated().map { makeButton(index: $0.offset, title: $0.element) }
    buttons.forEach(buttonsView.addSubview)
    updateButtonSelection()
    setNeedsLayout()
  }

  func setSelectedIndex(_ index: Int, animated: Bool) {
    guard tabs.indices.contains(index), index != currentIndex else { return }
    let previousIndex = currentIndex
    currentIndex = index
    updateButtonSelection()

    guard animated, !isDragging else {
      selectionGlass.frame = frame(for: index) ?? .zero
      return
    }
    animateSelection(from: previousIndex, to: index)
  }

  private func makeButton(index: Int, title: String) -> UIButton {
    var configuration = UIButton.Configuration.plain()
    configuration.image = UIImage(systemName: symbolName(for: title))
    configuration.imagePlacement = .top
    configuration.imagePadding = 3
    configuration.title = title
    configuration.contentInsets = .zero
    configuration.baseForegroundColor = inactiveColor
    configuration.titleTextAttributesTransformer = UIConfigurationTextAttributesTransformer { attributes in
      var attributes = attributes
      attributes.font = .systemFont(ofSize: 10, weight: .semibold)
      return attributes
    }

    let button = UIButton(configuration: configuration)
    button.tag = index
    button.accessibilityLabel = title
    button.addTarget(self, action: #selector(tabTapped(_:)), for: .touchUpInside)
    return button
  }

  @objc private func tabTapped(_ sender: UIButton) {
    select(sender.tag, notifyReact: true)
  }

  private func select(_ index: Int, notifyReact: Bool) {
    guard tabs.indices.contains(index) else { return }
    impactFeedback.impactOccurred()
    let changed = index != currentIndex
    let previousIndex = currentIndex
    currentIndex = index
    updateButtonSelection()

    if changed {
      animateSelection(from: previousIndex, to: index)
    } else if let frame = frame(for: index) {
      settle(to: frame)
    }

    if notifyReact {
      onTabPress(["index": index])
    }
  }

  private func animateSelection(from sourceIndex: Int, to destinationIndex: Int) {
    guard let destination = frame(for: destinationIndex) else { return }
    let source = presentationFrame()
    stopAnimations(at: source)

    guard sourceIndex != destinationIndex, !UIAccessibility.isReduceMotionEnabled else {
      selectionGlass.frame = destination
      return
    }

    let stretchingRight = destination.midX > source.midX
    var stretched = destination
    if stretchingRight {
      stretched.origin.x = source.minX
      stretched.size.width = max(destination.maxX - source.minX, destination.width)
    } else {
      stretched.origin.x = min(destination.minX, source.minX)
      stretched.size.width = max(source.maxX - destination.minX, destination.width)
    }

    // Two spring phases move the leading edge first and let the trailing edge
    // catch up. Both mutate the same UIVisualEffectView, retaining its refraction.
    let lead = UIViewPropertyAnimator(duration: 0.24, dampingRatio: 0.78) { [weak self] in
      self?.selectionGlass.frame = stretched
      self?.layoutSelectionDecoration()
    }
    lead.addCompletion { [weak self] position in
      guard let self, position == .end else { return }
      self.settle(to: destination)
    }
    activeAnimator = lead
    animateSpecularHighlight()
    lead.startAnimation()
  }

  private func settle(to destination: CGRect) {
    let animator = UIViewPropertyAnimator(duration: 0.34, dampingRatio: 0.72) { [weak self] in
      self?.selectionGlass.frame = destination
      self?.layoutSelectionDecoration()
    }
    settleAnimator = animator
    animator.startAnimation()
  }

  private func stopAnimations(at frame: CGRect? = nil) {
    activeAnimator?.stopAnimation(true)
    settleAnimator?.stopAnimation(true)
    activeAnimator = nil
    settleAnimator = nil
    selectionGlass.layer.removeAllAnimations()
    selectionGlass.frame = frame ?? selectionGlass.frame
  }

  @objc private func handlePan(_ gesture: UIPanGestureRecognizer) {
    guard !tabs.isEmpty, let first = frame(for: 0), let last = frame(for: tabs.count - 1) else { return }
    let location = gesture.location(in: buttonsView)

    switch gesture.state {
    case .began:
      isDragging = true
      dragStartIndex = currentIndex
      stopAnimations(at: presentationFrame())
      impactFeedback.prepare()
    case .changed:
      let clampedCenter = min(max(location.x, first.midX), last.midX)
      let nominalWidth = first.width
      let distance = abs(clampedCenter - (frame(for: dragStartIndex)?.midX ?? clampedCenter))
      let width = nominalWidth + min(Metrics.maximumStretch, distance * 0.30)
      selectionGlass.frame = CGRect(x: clampedCenter - width / 2, y: first.minY, width: width, height: first.height)
      layoutSelectionDecoration()
      let hoverIndex = nearestIndex(to: clampedCenter)
      updateButtonSelection(visualIndex: hoverIndex)
    case .ended, .cancelled, .failed:
      isDragging = false
      let index = nearestIndex(to: min(max(location.x, first.midX), last.midX))
      updateButtonSelection()
      select(index, notifyReact: true)
    default:
      break
    }
  }

  private func frame(for index: Int) -> CGRect? {
    guard tabs.indices.contains(index), buttonsView.bounds.width > 0 else { return nil }
    let slotWidth = buttonsView.bounds.width / CGFloat(tabs.count)
    return CGRect(
      x: CGFloat(index) * slotWidth + Metrics.inset,
      y: Metrics.inset,
      width: slotWidth - (Metrics.inset * 2),
      height: buttonsView.bounds.height - (Metrics.inset * 2)
    )
  }

  private func nearestIndex(to x: CGFloat) -> Int {
    guard tabs.count > 1 else { return 0 }
    let slotWidth = buttonsView.bounds.width / CGFloat(tabs.count)
    return min(max(Int((x / slotWidth).rounded()), 0), tabs.count - 1)
  }

  private func presentationFrame() -> CGRect {
    selectionGlass.layer.presentation()?.frame ?? selectionGlass.frame
  }

  private func updateButtonSelection(visualIndex: Int? = nil) {
    let selected = visualIndex ?? currentIndex
    buttons.enumerated().forEach { index, button in
      var configuration = button.configuration
      configuration?.baseForegroundColor = index == selected ? activeColor : inactiveColor
      button.configuration = configuration
      button.accessibilityTraits = index == selected ? [.button, .selected] : .button
    }
  }

  private func updateAppearance() {
    backgroundGlass.alpha = isDark ? 0.85 : 0.96
    updateButtonSelection()
  }

  private var activeColor: UIColor { UIColor.systemBlue }
  private var inactiveColor: UIColor {
    isDark ? UIColor.white.withAlphaComponent(0.68) : UIColor.secondaryLabel
  }

  private func applyCapsuleCorners() {
    glassContainer.layer.cornerRadius = glassContainer.bounds.height / 2
    selectionGlass.layer.cornerRadius = selectionGlass.bounds.height / 2
    backgroundGlass.layer.cornerRadius = backgroundGlass.bounds.height / 2
    if #available(iOS 26.0, *) {
      glassContainer.cornerConfiguration = .capsule()
      backgroundGlass.cornerConfiguration = .capsule()
      selectionGlass.cornerConfiguration = .capsule()
    }
  }

  private func layoutSelectionDecoration() {
    selectionHighlight.frame = selectionGlass.contentView.bounds
    selectionRim.frame = selectionGlass.contentView.bounds
    let path = UIBezierPath(roundedRect: selectionRim.bounds.insetBy(dx: 0.5, dy: 0.5), cornerRadius: selectionRim.bounds.height / 2)
    selectionRim.path = path.cgPath
    applyCapsuleCorners()
  }

  private func animateSpecularHighlight() {
    let pulse = CABasicAnimation(keyPath: "opacity")
    pulse.fromValue = 0.55
    pulse.toValue = 1
    pulse.duration = 0.20
    pulse.timingFunction = CAMediaTimingFunction(name: .easeOut)
    selectionHighlight.add(pulse, forKey: "selectionPulse")
  }

  private func symbolName(for title: String) -> String {
    switch title.lowercased() {
    case "home": return "house.fill"
    case "package", "packages": return "calendar"
    case "care": return "heart.fill"
    case "experts": return "sparkles"
    case "today": return "heart.text.square"
    default: return "circle.fill"
    }
  }

  private static func makeGlassContainer() -> UIVisualEffectView {
    if #available(iOS 26.0, *) {
      let effect = UIGlassContainerEffect()
      effect.spacing = 10
      return UIVisualEffectView(effect: effect)
    }
    return UIVisualEffectView(effect: UIBlurEffect(style: .systemChromeMaterial))
  }

  private static func makeGlassView(interactive: Bool) -> UIVisualEffectView {
    if #available(iOS 26.0, *) {
      let effect = UIGlassEffect(style: .regular)
      effect.isInteractive = interactive
      return UIVisualEffectView(effect: effect)
    }
    return UIVisualEffectView(effect: UIBlurEffect(style: .systemThinMaterial))
  }
}
