/**
 * GOOGLE APPS SCRIPT FOR WEDDING RSVP & WISHES (UCAPAN)
 * 
 * SPREADSHEET ID: 1zT-Ctgjh_ITHhqQCk-tOdBpb7mrXnAI6FrnSEVwwoeg
 * SHEET NAME: Sheet1
 * 
 * CARA DEPLOY:
 * 1. Buka Google Sheets Anda (https://docs.google.com/spreadsheets/d/1zT-Ctgjh_ITHhqQCk-tOdBpb7mrXnAI6FrnSEVwwoeg).
 * 2. Pilih menu: Extensions -> Apps Script.
 * 3. Hapus kode default (myFunction) dan paste seluruh kode ini.
 * 4. Klik ikon Save (Disket).
 * 5. Klik tombol Deploy -> New deployment.
 * 6. Pada "Select type", pilih "Web app".
 * 7. Konfigurasi:
 *    - Description: "RSVP & Wishes API"
 *    - Execute as: "Me (email Anda)"
 *    - Who has access: "Anyone" (Sangat penting agar website bisa mengirim data tanpa login).
 * 8. Klik Deploy, lalu klik "Authorize access" jika diminta dan ikuti langkah izin keamanannya.
 * 9. Salin "Web app URL" (yang berakhiran `/exec`).
 * 10. Buka berkas `index.html` pada editor website Anda, temukan baris `var APPS_SCRIPT_URL = "..."` (sekitar baris 2027) dan ganti isinya dengan URL Web App Anda.
 */

var SPREADSHEET_ID = "1zT-Ctgjh_ITHhqQCk-tOdBpb7mrXnAI6FrnSEVwwoeg";
var SHEET_NAME = "Sheet1";

function doPost(e) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      // Abaikan jika bukan JSON valid
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  }
  
  var timestamp = new Date();
  var namaTamu = data.nama_tamu || data.nama || "";
  var ucapan = data.ucapan || "";
  var konfirmasi = data.konfirmasi_kehadiran || data.konfirmasi || "Hadir";
  var jumlahTamu = data.jumlah_tamu || data.jumlah || 1;
  
  // Masukkan data ke kolom: Timestamp, Nama Tamu, Ucapan, Konfirmasi Kehadiran, Jumlah Tamu
  sheet.appendRow([timestamp, namaTamu, ucapan, konfirmasi, jumlahTamu]);
  
  var response = {
    status: "success",
    message: "Data berhasil disimpan"
  };
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  var rows = sheet.getDataRange().getValues();
  var wishes = [];
  
  // Lewati baris pertama (header)
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (row[1] && row[2]) { // Nama Tamu dan Ucapan tidak boleh kosong
      wishes.push({
        timestamp: row[0],
        nama_tamu: row[1],
        ucapan: row[2],
        konfirmasi: row[3],
        jumlah_tamu: row[4]
      });
    }
  }
  
  // Balikkan urutan agar yang terbaru tampil di atas
  wishes.reverse();
  
  return ContentService.createTextOutput(JSON.stringify(wishes))
    .setMimeType(ContentService.MimeType.JSON);
}
