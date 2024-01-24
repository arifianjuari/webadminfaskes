import React from "react";
import { Modal, Form, FormControl } from "react-bootstrap";
import * as XLSX from "xlsx";
import showToast from "../Toast/toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ show, onClose }) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const reader = new FileReader();
      reader.readAsBinaryString(e.target.files![0]);
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const itemsUsers = collection(db, "users");
        for (let index = 0; index < parsedData.length; index++) {
          const item: any = parsedData[index];
          await addDoc(itemsUsers, {
            alamat: item["Alamat"] || "",
            created_at: serverTimestamp(),
            foto_diri: item["foto_diri"] || "",
            foto_kartu_identitas: "",
            institusi: item["Institusi"] || "",
            is_online: false,
            jabatan: item["Jabatan"] || "",
            jenis_kelamin: item["Jenis Kelamin"] || "",
            kabupaten: item["Kabupaten"] || "",
            kecamatan: item["Kecamatan"] || "",
            last_active: serverTimestamp(),
            nama_lengkap: item["Nama Lengkap"] || "",
            nomor_bpjs: item["Nomor BPJS"] || "",
            nomor_identifikasi: item["Nomor Identitas (NIK)"] || "",
            nomor_telepon: item["Nomor Whatsapp"] || "",
            peran: item["Role"] || "",
            provinsi: item["Provinsi"] || "",
            status_aktivasi: false,
            status_skrining: false,
            tanggal_lahir: item["Tanggal Lahir"] || "",
            token: "",
          });
        }
        showToast("Import Berhasil");
        onClose();
      };
    } catch (error) {
      showToast("Import Gagal");
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Import User Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          style={{
            paddingBottom: "10px",
            borderBottom: "1px solid #d7d6d6",
            marginBottom: "20px",
          }}
          encType="multipart/form-data"
        >
          <Form.Group>
            <Form.Label>Pilih File Excel</Form.Label>
            <FormControl
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImportModal;
