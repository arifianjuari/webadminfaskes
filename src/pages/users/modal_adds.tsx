import React, { useEffect, useState } from "react";
import InputText from "../../component/Input/inputText";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import showToast from "../../component/Toast/toast";
import { Button, ModalBody, Row } from "react-bootstrap";
import UserData from "../../interface/users_interface";
import { Avatar } from "@material-tailwind/react";
import InputSelect from "../../component/Input/inputSelect";
import ItemValueData from "../../interface/item_value";

interface AddModalUserInfoProps {
  show: boolean;
  onHide: () => void;
}

function AddModalUserInfo(props: AddModalUserInfoProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<UserData | null>(null);
  const [provinsi, setProvinsi] = useState<ItemValueData[]>([]);
  const [kabupaten, setKabupaten] = useState<ItemValueData[]>([]);
  const [kecamatan, setKecamatan] = useState<ItemValueData[]>([]);
  const [provinsiFilter, setProvinsiFilter] = useState<ItemValueData[]>([]);
  const [kabupatenFilter, setKabupatenFilter] = useState<ItemValueData[]>([]);
  const [kecamatanFilter, setKecamatanFilter] = useState<ItemValueData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = collection(db, "provinsi");
        onSnapshot(userCollection, (snapshot) => {
          const item: ItemValueData[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              value: data.id,
              label: data.nama,
            };
          });
          setProvinsi(item);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDataKabupaten = async () => {
      try {
        const items = collection(db, "kabupaten");
        onSnapshot(items, (snapshot) => {
          const item: ItemValueData[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              value: data.id,
              label: data.nama,
            };
          });
          setKabupaten(item);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchDataKecamatan = async () => {
      try {
        const items = collection(db, "kecamatan");
        onSnapshot(items, (snapshot) => {
          const item: ItemValueData[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              value: data.id,
              label: data.nama,
            };
          });
          setKecamatan(item);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchDataKabupaten();
    fetchDataKecamatan();
  }, []);

  const onSelectProv = ({
    updateType,
    value,
  }: {
    updateType: string;
    value: string;
  }) => {
    const items = kabupaten.filter((item) =>
      item.value?.toLowerCase().includes(value.toLowerCase())
    );
    setKabupatenFilter(items);
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const userDocRef = collection(db, "users");
      await addDoc(userDocRef, {});
      showToast("Data Berhasil Ditambahkan");
      setLoading(false);
      props.onHide();
    } catch (error) {
      showToast("terjadi Kesalahan!");
      setLoading(false);
      props.onHide();
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
      <div className="d-flex justify-center">
        {formData?.foto_diri !== "" ? (
          <Avatar
            src={formData?.foto_diri}
            alt="avatar"
            variant="circular"
            placeholder={undefined}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <Avatar
            color="gray"
            alt="avatar"
            variant="circular"
            placeholder={undefined}
          />
        )}
      </div>

      <form>
        <Row>
          <h3 className="mt-3 font-bold mb-3">Detail Data Diri</h3>
        </Row>
        <Row className="d-flex justify-content-between">
          <InputText
            type="text"
            defaultValue={formData?.nama_lengkap}
            updateType="nama_lengkap"
            labelTitle="Nama Lengkap *"
            placeholder="Nama Lengkap"
            errorMessage={errorMessage}
            updateFormValue={updateFormValue}
          />
          <InputText
            defaultValue={formData?.peran}
            type="text"
            updateType="peran"
            labelTitle="Role *"
            placeholder="Role"
            errorMessage={errorMessage}
            updateFormValue={updateFormValue}
          />
        </Row>
        <Row className="d-flex justify-content-between">
          <InputText
            type="text"
            defaultValue={formData?.nomor_identifikasi}
            updateType="nomor_identitas"
            labelTitle="Nomor Identitas *"
            placeholder=""
            errorMessage={errorMessage}
            updateFormValue={updateFormValue}
          />
          <InputText
            defaultValue={formData?.nomor_bpjs}
            type="text"
            updateType="nomor_bpjs"
            labelTitle="Nomor BPJS *"
            errorMessage={errorMessage}
            updateFormValue={updateFormValue}
          />
        </Row>
        <Row className="d-flex justify-content-between">
          <InputText
            type="text"
            defaultValue={formData?.institusi}
            updateType="institusi"
            labelTitle="Institusi *"
            errorMessage={errorMessage}
            updateFormValue={updateFormValue}
          />
          <InputSelect
            labelTitle="Jenis kelamin *"
            updateType="dropdownValue"
            defaultValue={formData?.jenis_kelamin}
            updateFormValue={updateFormValue}
            options={[
              { value: "Laki-Laki", label: "Laki-Laki" },
              { value: "Perempuan", label: "Perempuan" },
            ]}
          />
        </Row>
        <Row className="d-flex justify-content-between">
          <InputText
            type="text"
            defaultValue={formData?.nomor_telepon}
            updateType="nomor_whatsapp"
            labelTitle="Nomor Whatsapp *"
            errorMessage={errorMessage}
            updateFormValue={updateFormValue}
          />
          <InputSelect
            labelTitle="Provinsi *"
            updateType="dropdownValue"
            defaultValue={formData?.provinsi !== "" ? formData?.provinsi : ""}
            updateFormValue={onSelectProv}
            options={provinsi}
          />
        </Row>
        <Row className="d-flex justify-content-between">
          <InputSelect
            labelTitle="Kabupaten *"
            updateType="dropdownValue"
            defaultValue={formData?.kabupaten !== "" ? formData?.kabupaten : ""}
            updateFormValue={updateFormValue}
            options={kabupatenFilter}
          />
          <InputSelect
            labelTitle="Kecamatan *"
            updateType="dropdownValue"
            defaultValue={formData?.kecamatan !== "" ? formData?.kecamatan : ""}
            updateFormValue={updateFormValue}
            options={kecamatanFilter}
          />
        </Row>
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

export default AddModalUserInfo;
