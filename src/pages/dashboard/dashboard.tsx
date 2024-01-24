import React from "react";
import MainLayout from "../../component/Layouts/MainLayout";

const Dashboard: React.FC = () => {
  return (
    <MainLayout title="Dashboard">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Dashboard</h4>
              <p className="card-description" />
              <div className="row">
                <div className="col-md-12">Halaman Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
