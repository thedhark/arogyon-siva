import ExpoModulesCore

public final class IosLiquidTabsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("IosLiquidTabs")

    View(IosLiquidTabsView.self) {
      Prop("tabs") { (view: IosLiquidTabsView, tabs: [String]) in
        view.setTabs(tabs)
      }

      Prop("selectedIndex") { (view: IosLiquidTabsView, index: Int) in
        view.setSelectedIndex(index, animated: true)
      }

      Prop("isDark") { (view: IosLiquidTabsView, isDark: Bool) in
        view.isDark = isDark
      }

      Events("onTabPress")
    }
  }
}
