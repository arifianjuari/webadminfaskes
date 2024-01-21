/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import MainLayout from "../../component/Layouts/MainLayout";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import EditModal from "./modal_edit";
import ShowModal from "./modal_show";
import { Modal } from "react-bootstrap";
import ApproveModal from "../../component/Modal/CustomModalConfirmation";
import showToast from "../../component/Toast/toast";
import HealthInfoData from "../../interface/health_info_interface";
import AddModalHealthInfo from "./modal_adds";

const HealthInfo: React.FC = () => {
  const [id, setId] = useState("");
  const [healthInfoData, setHealthInfoData] = useState<HealthInfoData[]>([]);
  const [healFilterData, setHealthInfoFilterData] = useState<HealthInfoData[]>(
    []
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editItemId, setEditItemId] = useState<HealthInfoData | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleShowDelete = (id: string) => {
    setId(id);
    setShowApproveModal(true);
  };

  const handleCloseApprove = () => {
    // Logic for handling "Batalkan" button click
    setShowApproveModal(false);
  };

  const onSubmitApprove = async () => {
    try {
      const faskesDocRef = doc(db, "healthInfo", id);
      await deleteDoc(faskesDocRef);
      setShowApproveModal(false);
      showToast("Data berhasil dihapus");
    } catch (error) {
      setShowApproveModal(false);
      console.error("Error deleting document:");
    }
  };
  const handleEditClick = async (itemId: HealthInfoData) => {
    setEditItemId(itemId);
    setShowEditModal(true);
  };

  const handleViewClick = (data: HealthInfoData) => {
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
        // Reference to the "faskes" collection in Firestore
        const faskesCollection = collection(db, "healthInfo");

        // Listen for changes in the "faskes" collection
        const unsubscribe = onSnapshot(faskesCollection, (snapshot) => {
          const healthInfo: HealthInfoData[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              deskripsi: data.deskripsi,
              foto: data.foto,
              id: data.id,
              institusi: data.institusi,
              judul: data.judul,
              penulis: data.penulis,
              publisher_user_id: data.publisher_user_id,
              tanggal_dibuat: data.tanggal_dibuat,
              waktu_dibuat: data.waktu_dibuat,
            };
          });
          setHealthInfoData(healthInfo);
          setHealthInfoFilterData(healthInfo);
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
      const filterFaskes = healthInfoData.filter((item) =>
        item.judul.toLowerCase().includes(name.toLowerCase())
      );
      setHealthInfoData(filterFaskes);
    } else {
      setHealthInfoData(healFilterData);
    }
  };
  return (
    <MainLayout>
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4 className="card-title">Fasilitas Kesehatan</h4>
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
              {healthInfoData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table datatables">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tanggal Rilis</th>
                        <th>Judul</th>
                        <th>Isi</th>
                        <th>Penulis</th>
                        {/* <th>Status</th> */}
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthInfoData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{`${item.tanggal_dibuat} ${item.waktu_dibuat}`}</td>
                          <td>{item.judul}</td>
                          <td>{item.deskripsi}</td>
                          <td>{item.penulis}</td>
                          {/* <td>{item.}</td> */}
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
                              onClick={() => handleShowDelete(item.id)}
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

      <Modal className="add" show={showAddModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            <h3>Tambah Fasilitas Kesehatan</h3>
          </Modal.Title>
        </Modal.Header>
        <AddModalHealthInfo show={showAddModal} onHide={handleEditModalClose} />
      </Modal>
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
        {/* <EditModal
          show={showEditModal}
          onHide={handleEditModalClose}
          faskedData={editItemId!}
        /> */}
      </Modal>
      <Modal
        className="edit"
        show={showViewModal}
        onHide={handleEditModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            <h3>Fasilitas Kesehatan</h3>
          </Modal.Title>
        </Modal.Header>
        {/* <ShowModal
          show={showViewModal}
          onHide={handleEditModalClose}
          faskedData={editItemId!}
        /> */}
      </Modal>
      <ApproveModal
        show={showApproveModal}
        handleClose={handleCloseApprove}
        handleCloseApprove={handleCloseApprove}
        onSubmitApprove={onSubmitApprove}
        message={"Apakah anda yakin ingin menghapus data ini?"}
      />
    </MainLayout>
  );
};

export default HealthInfo;
