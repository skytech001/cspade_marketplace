import React, { useEffect } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

import { getSummary } from "../features/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, summary } = useSelector((store) => store.dashboard);

  useEffect(() => {
    dispatch(getSummary());
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        summary && (
          <>
            <div className="row center">
              <div className="card card-body">
                <p>
                  {summary.users && summary.users[0]
                    ? summary.users[0].numUsers
                    : 0}
                </p>
                <p>Users</p>
              </div>

              <div className="card">
                <p>
                  {summary.orders && summary.orders[0]
                    ? summary.orders[0].numOrders
                    : 0}
                </p>
                <p>Users</p>
              </div>
              <div className="card">
                <p>
                  $
                  {summary.orders && summary.users[0]
                    ? summary.orders[0].totalSales.toFixed(2)
                    : 0}
                </p>
                <p>Users</p>
              </div>
            </div>
            <div className="">
              <h2>Sales</h2>
              {summary.dailyOrders.length === 0 ? (
                <MessageBox>No Sales</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400%"
                  chartType="AreaChart"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ["Date", "Sales"],
                    ...summary.dailyOrders.map((item) => [
                      item._id,
                      item.sales,
                    ]),
                  ]}
                ></Chart>
              )}
            </div>

            <div className="">
              <h2>Category</h2>
              {summary.productCategory.length === 0 ? (
                <MessageBox>No Category</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400%"
                  chartType="PieChart"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ["Category", "Products"],
                    ...summary.productCategory.map((item) => [
                      item._id,
                      item.count,
                    ]),
                  ]}
                  pieHole="0.4"
                ></Chart>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default DashboardScreen;
