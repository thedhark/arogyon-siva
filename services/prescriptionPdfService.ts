import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Prescription } from '@/hooks/useRecordsStore';

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function prescriptionHtml(prescription: Prescription) {
  const doctor = escapeHtml(prescription.doctorName);
  const specialty = escapeHtml(prescription.specialty);
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>
    @page { margin: 32px; } body { font-family: Helvetica, Arial, sans-serif; color: #182230; } h1 { color: #208AEF; margin: 0 0 4px; } .subtitle { color: #64748B; margin: 0 0 28px; } .line { border-top: 1px solid #DCE5EF; margin: 18px 0; } .label { color: #64748B; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; } .value { font-size: 16px; margin-top: 4px; } .notice { padding: 14px; background: #F0F8FF; border-radius: 8px; font-size: 13px; line-height: 20px; }
  </style></head><body><h1>Arogyon</h1><p class="subtitle">Digital prescription summary</p><div class="line"></div>
  <p class="label">Prescribing clinician</p><p class="value"><strong>${doctor}</strong><br />${specialty}</p>
  <p class="label">Issued</p><p class="value">${escapeHtml(prescription.date)}</p>
  <p class="label">Valid until</p><p class="value">${escapeHtml(prescription.validUntil)}</p>
  <p class="label">Medicines prescribed</p><p class="value">${escapeHtml(prescription.medicinesCount)}</p><div class="line"></div>
  <p class="notice">This PDF is generated from the prescription details stored in Arogyon. Medicine names and dosage instructions are not included in the available record data.</p>
  </body></html>`;
}

/** Generates a PDF file from the current prescription and opens the system share/save sheet. */
export async function exportPrescriptionPdf(prescription: Prescription) {
  const html = prescriptionHtml(prescription);
  if (Platform.OS === 'web') {
    await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(uri, {
    UTI: '.pdf',
    mimeType: 'application/pdf',
    dialogTitle: `Save ${prescription.doctorName}'s prescription`,
  });
}
