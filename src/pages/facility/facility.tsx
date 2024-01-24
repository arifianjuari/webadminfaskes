/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import MainLayout from "../../component/Layouts/MainLayout";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import FaskesData from "../../interface/fasker_interface";
import EditModal from "./modal_edit";
import AddModal from "./modal_add";
import ShowModal from "./modal_show";
import { Button, Modal } from "react-bootstrap";
import ApproveModal from "../../component/Modal/CustomModalConfirmation";
import showToast from "../../component/Toast/toast";
import ImportFaskesModal from "../../component/Modal/ImportFaskesModal";

const FacilityHealth: React.FC = () => {
  const [id, setId] = useState("");
  const [faskesData, setFaskesData] = useState<FaskesData[]>([]);
  const [faskesFilterData, setFaskesFilterData] = useState<FaskesData[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editItemId, setEditItemId] = useState<FaskesData | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showModalImport, setShowModalImport] = useState(false);

  const handleShowModalImport = () => {
    setShowModalImport(true);
  };
  const handleCloseModalImport = () => {
    setShowModalImport(false);
  };

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
      const faskesDocRef = doc(db, "faskes", id);
      await deleteDoc(faskesDocRef);
      setShowApproveModal(false);
      showToast("Data berhasil dihapus");
    } catch (error) {
      setShowApproveModal(false);
      console.error("Error deleting document:");
    }
  };
  const handleEditClick = async (itemId: FaskesData) => {
    setEditItemId(itemId);
    setShowEditModal(true);
  };

  const handleViewClick = (data: FaskesData) => {
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
        const faskesCollection = collection(db, "faskes");

        // Listen for changes in the "faskes" collection
        const unsubscribe = onSnapshot(faskesCollection, (snapshot) => {
          const faskes: FaskesData[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              alamat_faskes: data.alamat_faskes,
              created_at: data.created_at, // Assuming Unix timestamp in seconds
              deskripsi_faskes: data.deskripsi_faskes,
              foto_faskes: data.foto_faskes,
              kategori_faskes: data.kategori_faskes,
              latitude: data.latitude,
              longitude: data.longitude,
              nama_faskes: data.nama_faskes,
              nama_petugas: data.nama_petugas,
              nomor_whatsapp_faskes: data.nomor_whatsapp_faskes,
            };
          });
          setFaskesData(faskes);
          setFaskesFilterData(faskes);
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
      const filterFaskes = faskesData.filter((user) =>
        user.nama_faskes.toLowerCase().includes(name.toLowerCase())
      );
      setFaskesData(filterFaskes);
    } else {
      setFaskesData(faskesFilterData);
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
                    <i className="ti-plus btn-icon-prepend"></i>Tambah Data{" "}
                  </button>
                </div>
              </div>
              {faskesData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table datatables">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Fasilitas Kesehatan</th>
                        <th>Kategori</th>
                        <th>Alamat</th>
                        <th>Nomor WhatsApp</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faskesData.map((user, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{user.nama_faskes}</td>
                          <td>{user.kategori_faskes}</td>
                          <td>{user.alamat_faskes}</td>
                          <td>{user.nomor_whatsapp_faskes}</td>
                          <td>
                            <button
                              className="btn-outline-primary mr-2 font-weight-bold"
                              onClick={() => handleViewClick(user)}
                            >
                              Lihat Data
                            </button>
                            <button
                              className="btn-outline-success mr-2 font-weight-bold"
                              onClick={() => handleEditClick(user)}
                            >
                              Sunting
                            </button>
                            <button
                              className="btn-outline-danger font-weight-bold"
                              onClick={() => handleShowDelete(user.id)}
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
      <ImportFaskesModal
        show={showModalImport}
        onClose={handleCloseModalImport}
      />
      <Modal className="add" show={showAddModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            <h3>Tambah Fasilitas Kesehatan</h3>
          </Modal.Title>
        </Modal.Header>
        <AddModal
          show={showAddModal}
          onHide={handleEditModalClose}
          faskedData={editItemId!}
        />
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
        <EditModal
          show={showEditModal}
          onHide={handleEditModalClose}
          faskedData={editItemId!}
        />
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
        <ShowModal
          show={showViewModal}
          onHide={handleEditModalClose}
          faskedData={editItemId!}
        />
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

export default FacilityHealth;
