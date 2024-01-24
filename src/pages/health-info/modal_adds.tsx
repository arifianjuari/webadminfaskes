import React, { useEffect, useMemo, useRef, useState } from "react";
import InputText from "../../component/Input/inputText";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import showToast from "../../component/Toast/toast";
import { Button, ModalBody } from "react-bootstrap";
import HealthInfoData from "../../interface/health_info_interface";
import JoditEditor from "jodit-react";
import User from "../../interface/auth_interface";
import moment from "moment";

interface AddModalHealthInfoProps {
  show: boolean;
  onHide: () => void;
  user?: User;
}

function AddModalHealthInfo(props: AddModalHealthInfoProps) {
  const editor = useRef(null);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<HealthInfoData>({
    deskripsi: "",
    foto: "",
    id: "",
    institusi: "",
    judul: "",
    penulis: "",
    publisher_user_id: "",
    tanggal_dibuat: "",
    waktu_dibuat: "",
  });

  useEffect(() => {
    if (props.user)
      setFormData({
        ...formData,
        publisher_user_id: props.user.uid ?? "",
        tanggal_dibuat: moment(new Date()).format("DD-MM-YYYY").toString(),
        waktu_dibuat: moment(new Date()).format("HH:mm:ss").toString(),
        penulis: props.user.displayName ?? "",
      });
    console.log(formData);
  }, [props.user]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result?.toString() || "" });
      };
      console.log(formData.foto);

      reader.readAsDataURL(file);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/doc/
    }),
    []
  );

  const submitForm = async () => {
    setErrorMessage("");
    if (formData.tanggal_dibuat.trim() === "")
      return setErrorMessage("Tanggal Dibuat is required");
    if (formData.penulis.trim() === "")
      return setErrorMessage("Penulis is required");
    if (formData.institusi.trim() === "") {
      return setErrorMessage("institusi is required");
    }
    if (formData.judul.trim() === "") {
      return setErrorMessage("judul is required");
    }
    if (formData.deskripsi.trim() === "") {
      showToast("Isi Thumbnail is required");
      return setErrorMessage("Isi Thumbnail is required");
    }
    if (formData.foto.trim() === "") {
      return setErrorMessage("Gambar Thumbnail is required");
    } else {
      try {
        setLoading(true);
        const faskesDocRef = collection(db, "healthInfo");
        const currentDate = new Date();
        const id = currentDate.getTime();
        await addDoc(faskesDocRef, {
          deskripsi: formData.deskripsi,
          foto: formData.foto,
          id: id.toString(),
          institusi: formData.institusi,
          judul: formData.judul,
          penulis: formData.penulis,
          publisher_user_id: "",
          tanggal_dibuat: formData.tanggal_dibuat,
          waktu_dibuat: formData.waktu_dibuat,
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
          defaultValue={`${formData.tanggal_dibuat} ${formData.waktu_dibuat}`}
          updateType="tanggal_dibuat"
          containerStyle="mt-4"
          // readonly={formData.tanggal_dibuat !== "" ? true : false}
          labelTitle="Tanggal Rilis"
          errorMessage={errorMessage}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData.penulis}
          type="text"
          updateType="penulis"
          readonly={formData.penulis !== "" ? true : false}
          containerStyle="mt-4"
          labelTitle="Penulis"
          errorMessage={errorMessage}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData.institusi}
          type="text"
          updateType="institusi"
          containerStyle="mt-4"
          labelTitle="Institusi"
          errorMessage={errorMessage}
          updateFormValue={updateFormValue}
        />
        <InputText
          defaultValue={formData.judul}
          type="text"
          updateType="judul"
          containerStyle="mt-4"
          labelTitle="Judul"
          errorMessage={errorMessage}
          updateFormValue={updateFormValue}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="imageInput"
        />
        <label htmlFor="imageInput" style={{ cursor: "pointer" }}>
          {formData.foto ? (
            <img
              src={formData.foto}
              alt="Selected"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                position: "relative",
              }}
            />
          ) : (
            <div
              style={{
                border: "2px dashed #ddd",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p>Pilih Gambar</p>
            </div>
          )}
        </label>
        <JoditEditor
          value={formData.deskripsi}
          config={config}
          onBlur={(newContent) => {
            setFormData({ ...formData, deskripsi: newContent });
          }} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {
            setFormData({ ...formData, deskripsi: newContent });
          }}
        />

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

export default AddModalHealthInfo;
