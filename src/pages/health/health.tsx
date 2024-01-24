/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import MainLayout from "../../component/Layouts/MainLayout";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import AddModal from "./modal_add";
import { Modal } from "react-bootstrap";
import ApproveModal from "../../component/Modal/CustomModalConfirmation";
import showToast from "../../component/Toast/toast";
import HealthData from "../../interface/health_interface";
import EditHealthModal from "./modal_edit";
import ShowHealthModal from "./modal_show";

const FacilityHealth: React.FC = () => {
  const [id, setId] = useState("");
  const [healthData, sethealthData] = useState<HealthData[]>([]);
  const [healthFilterData, sethealthFilterData] = useState<HealthData[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editItemId, setEditItemId] = useState<HealthData | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [itemId, setItemId] = useState("");

  const handleShowDelete = (id: string) => {
    setItemId(id);
    setShowDelete(true);
  };
  const handleCloseDelete = () => {
    setItemId("");
    setShowDelete(false);
  };
  const handleSubmit = async () => {
    try {
      const faskesDocRef = doc(db, "healths", itemId);
      await deleteDoc(faskesDocRef);
      showToast("Data berhasil dihapus");
      setShowDelete(false);
    } catch (error) {
      setShowDelete(false);
      console.error("Error deleting document:");
    }
  };
  const handleEditClick = async (itemId: HealthData) => {
    setEditItemId(itemId);
    setShowEditModal(true);
  };

  const handleViewClick = (data: HealthData) => {
    setEditItemId(data);
    setShowViewModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setShowViewModal(false);
    setEditItemId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the "health" collection in Firestore
        const healthCollection = collection(db, "healths");

        // Listen for changes in the "health" collection
        const unsubscribe = onSnapshot(healthCollection, (snapshot) => {
          const health: HealthData[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              alamat_laporan: data.alamat_laporan,
              created_at: data.created_at,
              institusi_pelapor: data.institusi_pelapor,
              keluhan: data.keluhan,
              latitude: data.latitude,
              longitude: data.longitude,
              nama_pasien: data.nama_pasien,
              nama_pelapor: data.nama_pelapor,
              nomor_telepon_pelapor: data.nomor_telepon_pelapor,
              pemberi_bantuan: data.pemberi_bantuan,
              skala_sakit: data.skala_sakit,
              status: data.status,
              waktu_laporan: data.waktu_laporan,
            };
          });
          sethealthData(health);
          sethealthFilterData(health);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on component mount

  const SearchUser = (name: string) => {
    if (name !== "") {
      const filterFaskes = healthData.filter((user) =>
        user.nama_pelapor!.toLowerCase().includes(name.toLowerCase())
      );
      sethealthData(filterFaskes);
    } else {
      sethealthData(healthFilterData);
    }
  };
  return (
    <MainLayout>
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4 className="card-title">Laporan Kesehatan</h4>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search by name..."
                  onChange={(e) => SearchUser(e.target.value)}
                />
                <div className="float-right">
                  <button
                    className="btn btn-primary btn-icon-text"
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="ti-plus btn-icon-prepend"></i>Tambah Data{" "}
                  </button>
                </div>
              </div>
              {healthData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table datatables">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama Pembuat Laporan</th>
                        <th>Institusi</th>
                        <th>Nama Petugas</th>
                        <th>Alamat Petugas</th>
                        <th>Keluhan Singkat</th>
                        <th>Skala Sakit</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.nama_pelapor}</td>
                          <td>{item.institusi_pelapor}</td>
                          <td>{item.nama_pasien}</td>
                          <td>{item.alamat_laporan}</td>
                          <td>{item.keluhan}</td>
                          <td>{item.skala_sakit}</td>
                          <td>
                            <button
                              className="btn-outline-primary mr-2 font-weight-bold"
                              onClick={() => handleViewClick(item)}
                            >
                              Lihat Data
                            </button>
                            <button
                              className="btn-outline-success mr-2 font-weight-bold"
                              onClick={() => handleEditClick(item)}
                            >
                              Sunting
                            </button>
                            <button
                              className="btn-outline-danger font-weight-bold"
                              onClick={() => handleShowDelete(item.id || "")}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center">Data tidak tersedia</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ApproveModal
        show={showDelete}
        handleClose={handleCloseDelete}
        handleCloseApprove={handleCloseDelete}
        onSubmitApprove={handleSubmit}
        message={"Apakah anda yakin ingin menghapus data ini?"}
      />
      <Modal className="add" show={showAddModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            <h3>Tambah Data</h3>
          </Modal.Title>
        </Modal.Header>
        <AddModal show={showAddModal} onHide={handleEditModalClose} />
      </Modal>
      {editItemId != null ? (
        <Modal
          className="edit"
          show={showEditModal}
          onHide={handleEditModalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center">
              <h3>Sunting Data</h3>
            </Modal.Title>
          </Modal.Header>
          <EditHealthModal
            show={showAddModal}
            onHide={handleEditModalClose}
            formData={editItemId!}
          />
        </Modal>
      ) : (
        <></>
      )}
      {editItemId != null ? (
        <Modal
          className="show"
          show={showViewModal}
          onHide={handleEditModalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center">
              <h3>Laporan Kesehatan</h3>
            </Modal.Title>
          </Modal.Header>
          <ShowHealthModal
            show={showViewModal}
            onHide={handleEditModalClose}
            formData={editItemId!}
          />
        </Modal>
      ) : (
        <></>
      )}
    </MainLayout>
  );
};

export default FacilityHealth;
