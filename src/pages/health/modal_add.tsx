import React, { useState } from "react";
import FaskesData from "../../interface/fasker_interface";
import InputText from "../../component/Input/inputText";
import ErrorText from "../../component/Typography/ErrorText";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import showToast from "../../component/Toast/toast";
import { Button, ModalBody } from "react-bootstrap";
import HealthData from "../../interface/health_interface";
import moment from "moment";

interface AddModalProps {
  show: boolean;
  onHide: () => void;
}

function AddModal(props: AddModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<HealthData>({
    id: "",
    alamat_laporan: "",
    created_at: 0,
    institusi_pelapor: "",
    keluhan: "",
    latitude: 0,
    longitude: 0,
    nama_pasien: "",
    nama_pelapor: "",
    nomor_telepon_pelapor: "",
    pemberi_bantuan: [],
    skala_sakit: "",
    status: "",
    waktu_laporan: "",
  });

  const submitForm = async () => {
    setErrorMessage("");
    if (formData.nama_pelapor.trim() === "")
      return setErrorMessage("Nama Pembuat Laporan tidak boleh kosong");
    if (formData.institusi_pelapor?.trim() === "")
      return setErrorMessage("Institusi tidak boleh kosong");
    if (formData.nama_pasien?.trim() === "")
      return setErrorMessage("Nama Petugas tidak boleh kosong");
    if (formData.alamat_laporan?.trim() === "")
      return setErrorMessage("Alamat Lokasi tidak boleh kosong");
    if (formData.keluhan?.trim() === "")
      return setErrorMessage("Keluhan tidak boleh kosong");
    if (formData.waktu_laporan?.trim() === "")
      return setErrorMessage("Waktu Lapor tidak boleh kosong");
    if (formData.skala_sakit?.trim() === "")
      return setErrorMessage("Skala Sakit tidak boleh kosong");
    else {
      try {
        console.log(formData);
        setLoading(true);
        const faskesDocRef = collection(db, "healths");
        await addDoc(faskesDocRef, {
          alamat_laporan: formData.alamat_laporan,
          created_at: serverTimestamp(),
          institusi_pelapor: formData.institusi_pelapor,
          keluhan: formData.keluhan,
          latitude: 0,
          longitude: 0,
          nama_pasien: formData.nama_pasien,
          nama_pelapor: formData.nama_pelapor,
          nomor_telepon_pelapor: "",
          pemberi_bantuan: [],
          skala_sakit: formData.skala_sakit,
          status: "",
          waktu_laporan: moment(formData.waktu_laporan).toISOString(),
        });
        showToast("Data Berhasil Ditambahkan");
        setLoading(false);
        props.onHide();
      } catch (error) {
        showToast("terjadi Kesalahan!");
        setLoading(false);
        props.onHide();
      }
    }
  };
  const updateFormValue = ({
    updateType,
    value,
  }: {
    updateType: string;
    value: string;
  }) => {
    setErrorMessage("");
    setFormData({ ...formData, [updateType]: value });
  };
  return (
    <ModalBody>
      <form>
        <InputText
          type="text"
          defaultValue={formData?.nama_pelapor}
          updateType="nama_pelapor"
          containerStyle="mt-4"
          errorMessage={errorMessage}
          labelTitle="Nama Pembuat Laporan"
          updateFormValue={updateFormValue}
        />

        <InputText
          defaultValue={formData?.institusi_pelapor}
          type="text"
          updateType="institusi_pelapor"
          errorMessage={errorMessage}
          containerStyle="mt-4"
          labelTitle="Institusi"
          updateFormValue={updateFormValue}
        />

        <InputText
          defaultValue={formData?.nama_pasien}
          type="text"
          updateType="nama_pasien"
          containerStyle="mt-4"
          errorMessage={errorMessage}
          labelTitle="Nama Petugas"
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.alamat_laporan}
          type="text"
          updateType="alamat_laporan"
          containerStyle="mt-4"
          errorMessage={errorMessage}
          labelTitle="Alamat Lokasi"
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.keluhan}
          type="text"
          updateType="keluhan"
          containerStyle="mt-4"
          errorMessage={errorMessage}
          labelTitle="Keluhan"
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.waktu_laporan}
          type="date"
          updateType="waktu_laporan"
          containerStyle="mt-4"
          errorMessage={errorMessage}
          labelTitle="Waktu Lapor"
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.skala_sakit}
          type="number"
          updateType="skala_sakit"
          containerStyle="mt-4"
          errorMessage={errorMessage}
          labelTitle="Skala Sakit"
          updateFormValue={updateFormValue}
        />
        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

        <div className="d-flex justify-content-center mt-2">
          <button className="btn btn-danger mr-2" onClick={props.onHide}>
            Batal
          </button>
          <Button className="bg-success" variant="success" onClick={submitForm}>
            Simpan
          </Button>
        </div>
      </form>
    </ModalBody>
  );
}

export default AddModal;
