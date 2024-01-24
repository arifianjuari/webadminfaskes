import React from "react";
import { Modal, Form, FormControl } from "react-bootstrap";
import * as XLSX from "xlsx";
import showToast from "../Toast/toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

interface ImportFaskesModalProps {
  show: boolean;
  onClose: () => void;
}

const ImportFaskesModal: React.FC<ImportFaskesModalProps> = ({
  show,
  onClose,
}) => {
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
        const items = collection(db, "faskes");
        for (let index = 0; index < parsedData.length; index++) {
          const item: any = parsedData[index];
          await addDoc(items, {
            alamat_faskes: item["Alamat"] || "",
            kategori_faskes: item["Kategori Faskes"] || "",
            nama_faskes: item["Nama Faskes"] || "",
            nomor_whatsapp_faskes: item["Nomor Whatsapp"] || "",
            created_at: serverTimestamp(),
            deskripsi_faskes: item["Deskripsi"] || "",
            foto_faskes: "",
            latitude: 0,
            longitude: 0,
            nama_petugas: item["Nama Petugas"] || "",
          });
        }
        showToast("Import Data Faskes Berhasil");
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
        <Modal.Title>Import Faskes Excel</Modal.Title>
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

export default ImportFaskesModal;
