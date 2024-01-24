import React, { useState } from "react";
import InputText from "../../component/Input/inputText";
import { ModalBody } from "react-bootstrap";
import HealthData from "../../interface/health_interface";
import moment from "moment";

interface ShowHealthModalProps {
  show: boolean;
  onHide: () => void;
  formData: HealthData;
}

function ShowHealthModal(props: ShowHealthModalProps) {
  const [formData, setFormData] = useState<HealthData>({
    id: props.formData.id || "",
    alamat_laporan: props.formData.alamat_laporan,
    created_at: 0,
    institusi_pelapor: props.formData.institusi_pelapor,
    keluhan: props.formData.keluhan,
    latitude: props.formData.latitude,
    longitude: props.formData.longitude,
    nama_pasien: props.formData.nama_pasien,
    nama_pelapor: props.formData.nama_pelapor,
    nomor_telepon_pelapor: props.formData.nomor_telepon_pelapor,
    pemberi_bantuan: [],
    skala_sakit: props.formData.skala_sakit,
    status: "",
    waktu_laporan: props.formData.waktu_laporan
      ? props.formData.waktu_laporan
      : "",
  });
  const updateFormValue = ({
    updateType,
    value,
  }: {
    updateType: string;
    value: string;
  }) => {
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
          labelTitle="Nama Pembuat Laporan"
          readonly={true}
          updateFormValue={updateFormValue}
        />

        <InputText
          defaultValue={formData?.institusi_pelapor}
          type="text"
          updateType="institusi_pelapor"
          containerStyle="mt-4"
          labelTitle="Institusi"
          readonly={true}
          updateFormValue={updateFormValue}
        />

        <InputText
          defaultValue={formData?.nama_pasien}
          type="text"
          updateType="nama_pasien"
          containerStyle="mt-4"
          labelTitle="Nama Petugas"
          readonly={true}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.alamat_laporan}
          type="text"
          updateType="alamat_laporan"
          containerStyle="mt-4"
          labelTitle="Alamat Lokasi"
          readonly={true}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.keluhan}
          type="text"
          updateType="keluhan"
          containerStyle="mt-4"
          labelTitle="Keluhan"
          readonly={true}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={moment(parseInt(formData.waktu_laporan, 10))
            .format("YYYY-MM-DD")
            .toString()}
          type="text"
          updateType="waktu_laporan"
          containerStyle="mt-4"
          labelTitle="Waktu Lapor"
          readonly={true}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData?.skala_sakit}
          type="text"
          updateType="skala_sakit"
          containerStyle="mt-4"
          labelTitle="Skala Sakit"
          readonly={true}
          updateFormValue={updateFormValue}
        />

        <div className="d-flex justify-content-center mt-2">
          <button className="btn btn-danger mr-2" onClick={props.onHide}>
            Batal
          </button>
        </div>
      </form>
    </ModalBody>
  );
}

export default ShowHealthModal;
