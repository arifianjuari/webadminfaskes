/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../component/Layouts/MainLayout";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import UserData from "../../interface/users_interface";
import ApproveModal from "../../component/Modal/CustomModalConfirmation";
import showToast from "../../component/Toast/toast";
import { Button, Modal } from "react-bootstrap";
import AddModalUserInfo from "./modal_adds";
import ImportModal from "../../component/Modal/importModal";

const UsersActive: React.FC = () => {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [usersFilterData, setUsersFilterData] = useState<UserData[]>([]);
  const [idUser, setidUser] = useState("");

  const [showModalImport, setShowModalImport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const handleShowDelete = (id: string) => {
    setidUser(id);
    setShowDelete(true);
  };
  const handleCloseDelete = () => {
    setidUser("");
    setShowDelete(false);
  };
  const handleSubmit = async () => {
    try {
      const faskesDocRef = doc(db, "users", idUser);
      await deleteDoc(faskesDocRef);
      showToast("Data berhasil dihapus");
      setShowDelete(false);
    } catch (error) {
      setShowDelete(false);
      console.error("Error deleting document:");
    }
  };
  const handleShowModalImport = () => {
    setShowModalImport(true);
  };
  const handleCloseModalImport = () => {
    setShowModalImport(false);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the "users" collection in Firestore
        const userCollection = collection(db, "users");

        // Listen for changes in the "users" collection
        onSnapshot(userCollection, (snapshot) => {
          const userData: UserData[] = snapshot.docs
            .filter((doc) => doc.data().status_aktivasi !== "ACTIVE")
            .map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                alamat: data.alamat,
                created_at: data.created_at,
                foto_diri: data.foto_diri,
                foto_kartu_identitas: data.foto_kartu_identitas,
                institusi: data.institusi,
                is_online: data.is_online,
                jabatan: data.jabatan,
                jenis_kelamin: data.jenis_kelamin,
                kabupaten: data.kabupaten,
                kecamatan: data.kecamatan,
                last_active: data.last_active,
                nama_lengkap: data.nama_lengkap,
                nomor_bpjs: data.nomor_bpjs,
                nomor_identifikasi: data.nomor_identifikasi,
                nomor_telepon: data.nomor_telepon,
                peran: data.peran,
                provinsi: data.provinsi,
                status_aktivasi: data.status_aktivasi,
                status_skrining: data.status_skrining,
                tanggal_lahir: data.tanggal_lahir,
                token: data.token,
              };
            });
          setUsersData(userData);
          setUsersFilterData(userData);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, []); // Run once on component mount
  const SearchUser = (name: string) => {
    if (name !== "") {
      const filteredUsers = usersFilterData.filter((user) =>
        user.nama_lengkap!.toLowerCase().includes(name.toLowerCase())
      );
      setUsersData(filteredUsers);
    } else {
      setUsersData(usersFilterData);
    }
  };
  return (
    <MainLayout title="User Aktif">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4 className="card-title">User Aktif</h4>
                <div>
                  <h1 className="mb-2">Import Excel</h1>
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by name..."
                  onChange={(e) => SearchUser(e.target.value)}
                />
                <div className="row float-right">
                  <Button
                    variant="success"
                    className="bg-success mr-2"
                    onClick={handleShowModalImport}
                  >
                    Import Excel
                  </Button>
                  <button
                    className="btn btn-primary btn-icon-text"
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="ti-plus btn-icon-prepend"></i>Tambah Data
                  </button>
                </div>
              </div>

              {usersData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table datatables">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama Lengkap</th>
                        <th>Role</th>
                        <th>Nomor Identitas (NIK)</th>
                        <th>Nomor BPJS</th>
                        <th>Jenis Kelamin</th>
                        <th>Nomor WhatsApp</th>
                        <th>Institusi</th>
                        <th>Provinsi</th>
                        <th>Kabupaten/Kota</th>
                        <th>Kecamatan</th>
                        <th>Alamat Petugas</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map((user, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{user.nama_lengkap}</td>
                          <td>{user.peran}</td>
                          <td>{user.nomor_identifikasi}</td>
                          <td>{user.nomor_bpjs}</td>
                          <td>{user.jenis_kelamin}</td>
                          <td>{user.nomor_telepon}</td>
                          <td>{user.institusi}</td>
                          <td>{user.provinsi}</td>
                          <td>{user.kabupaten}</td>
                          <td>{user.kecamatan}</td>
                          <td>{user.alamat}</td>
                          <td>
                            <button className="btn-outline-primary mr-2 font-weight-bold">
                              Lihat Data
                            </button>
                            <button className="btn-outline-success mr-2 font-weight-bold">
                              Sunting
                            </button>
                            <button
                              className="btn-outline-danger font-weight-bold"
                              onClick={() => handleShowDelete(user.id || "")}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <ApproveModal
                    show={showDelete}
                    handleClose={handleCloseDelete}
                    handleCloseApprove={handleCloseDelete}
                    onSubmitApprove={handleSubmit}
                    message={"Apakah anda yakin ingin menghapus data ini?"}
                  />
                </div>
              ) : (
                <div className="text-center">Data tidak tersedia</div>
              )}
              <Modal
                className="add"
                show={showAddModal}
                onHide={handleCloseAddModal}
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-center">
                    <h3>Tambah Data</h3>
                  </Modal.Title>
                </Modal.Header>
                <AddModalUserInfo
                  show={showAddModal}
                  onHide={handleCloseAddModal}
                />
              </Modal>
              <ImportModal
                show={showModalImport}
                onClose={handleCloseModalImport}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UsersActive;
