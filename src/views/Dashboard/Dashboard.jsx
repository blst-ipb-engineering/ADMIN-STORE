import React from "react";
import {
  Card,
  Button,
  CardBody,
  CardFooter,
  CardTitle,
  CardHeader,
  Row,
  Col
} from "reactstrap";
import SpinnerGif from "../../assets/img/spinner-loading.gif";
import { ToastContainer, toast } from 'react-toastify';
import { BulletList } from 'react-content-loader'
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// function that returns a color based on an interval of numbers

import Stats from "../../components/Stats/Stats.jsx";
import Toaster from '../../components/UI/Toaster/Toaster';
import {
  DashboardStat,
  ListBranch,
  CheckBranchChosen,
  SetBranchSetting
} from "../../api/index";

import Popup from "../../components/Popup/Popup";

import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "../../variables/charts.jsx";
import Terlaris from "../../components/Insight/Terlaris/Terlaris";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      branchVerified: true,
      branchLists: [],
      branchFetching: false,
      verifiyingbranch: false,
      branchChosen: null,
      orderChartData: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              label: "Order.",
              fill: false,
              borderColor: "#fbc658",
              backgroundColor: "transparent",
              pointBorderColor: "#fbc658",
              pointRadius: 4,
              pointHoverRadius: 4,
              pointBorderWidth: 8
            },
            {
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              fill: false,
              label: "Order",
              borderColor: "#80808099",
              backgroundColor: "transparent",
              pointBorderColor: "#80808099",
              pointRadius: 4,
              pointHoverRadius: 4,
              pointBorderWidth: 8
            }
          ]
        },
        options: {
          legend: {
            display: false,
            position: "top"
          }
        }
      }
    }
  }

  formatuang(amount) {
    if (amount === null) {
      amount = 0;
    }
    // deletecomma
    let comadel = amount.toString().replace(/\,/g, '');
    let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    return price;
  }

  fetchDashboardData() {
    DashboardStat().then(async result => {

      // Data Jumlah Order Tahun Ini
      const newArrayMonthOrder = [];
      await result.OrderChart.map((value, index) => {
        newArrayMonthOrder[value.createdOn-1] = value.total_order;
      })
      

      // Data Jumlah Order Tahun Lalu
      const newArrayMonthOrderLastYear = [];
      await result.OrderChartLastYear.map((value, index) => {
        newArrayMonthOrderLastYear[value.createdOn-1] = value.total_order;
      })
      

      this.setState({
        data: result,
        orderChartData: {
          ...this.state.orderChartData,
          data: {
            ...this.state.orderChartData.data,
            datasets: [
              {
                ...this.state.orderChartData.data.datasets[0],
                data: newArrayMonthOrder
              },
              {
                ...this.state.orderChartData.data.datasets[1],
                data: newArrayMonthOrderLastYear
              }
            ]
          }
        }
      })


    })
  }

  componentDidMount() {
    this.fetchDashboardData();
    const content = {};

    this.setState({ branchFetching: true, verifiyingbranch: true });
    ListBranch(content).then(result => {
      if (this.unmounted) {
        // if will unmount        
        return
      };
      this.setState({
        branchFetching: false,
        branchLists: result.data.list
      });
    }).catch(err => {
      console.log(err)
      toast.error("Error Finance Network");
    })

    // mengecek apakah branch sudah diset atau belum untuk ke sistem keuangan
    // itu dicek dalam table API expressjs pada tabel company apakah sudah ada, jika belum ada harus diset
    CheckBranchChosen(CheckBranchChosen).then(result => {
      if (result.data == null) {
        this.setState({ branchVerified: false });
      } else {
        this.setState({ branchVerified: true });
      }

      this.setState({ verifiyingbranch: false });
    })
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  popUpBranchCloseHandler = (e) => {

  }

  onClickBranchHandler = (e, value) => {
    e.preventDefault();
    console.log(value);
    this.setState({ branchChosen: value });
  }

  onStartBranchHandler = (e, value) => {
    e.preventDefault();
    const content = {
      ...this.state.branchChosen
    };

    SetBranchSetting(content).then(result => {
      if (result.status === "Added") {
        const company = JSON.parse(localStorage.getItem('company'));
        const new_COMPANY = { ...company, branch: result.data.branchId };
        localStorage.setItem('company', JSON.stringify(new_COMPANY));
        toast.success("Pengaturan Berhasil");
        this.setState({ branchVerified: true });
      } else {
        this.setState({ branchVerified: false });
      }
    })


  }


  render() {
    let list_branch_card = <img src={SpinnerGif}></img>;
    if (this.state.branchLists.length > 0) {
      list_branch_card = this.state.branchLists.map((value, index) => (
        <div key={index} className={this.state.branchChosen !== null && value.id_branch == this.state.branchChosen.id_branch ? "branch-card-box branch-selected" : "branch-card-box"} onClick={(e) => this.onClickBranchHandler(e, value)}>
          <i className="nc-icon nc-shop text-default" />
          <span>{value.name_branch}</span>
        </div>
      ))
    }

    let body_select_branch =
      <div className="body-branch-selector">
        <h5>
          Sistem ini akan terintegrasi dengan sistem keuangan dan akutansi BLST.
        Silahkan tentukan salah satu cabang / <i>branch</i> mana penjualan akan dicatatkan
        </h5>

        <div className="body-box-selector">
          {list_branch_card}
        </div>
        <small>Pengaturan di atas hanya dilakukan sekali dan tidak dapat diubah</small>
        {this.state.branchChosen !== null ? (
          <Button color="success" size="lg" onClick={(e) => { this.onStartBranchHandler(e) }}>Mulai</Button>
        ) : null}
      </div>;

    return (
      <>
        {!this.state.branchVerified ? (
          <div className="branch-verficiation-wrapper">
            <Popup
              isOpen={true}
              onClosePopupHandler={(e) => this.popUpBranchCloseHandler(e)}
              headerTitle={"Selamat Datang"}
              body={body_select_branch}
            >
            </Popup>
          </div>

        ) : null}

        <div className="content">
          <Row>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs={5} md={4}>
                      <div className="icon-big text-center">
                        <i className="nc-icon nc-globe text-warning" />
                      </div>
                    </Col>
                    <Col xs={7} md={8}>
                      <div className="numbers">
                        <p className="card-category">Order</p>
                        <CardTitle tag="p">{this.state.data !== null ? this.state.data.Order : 0} </CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <Stats>
                    {[
                      {
                        i: "fas fa-sync-alt",
                        t: "Last Year"
                      }
                    ]}
                  </Stats>
                </CardFooter>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={3}>
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs={5} md={4}>
                      <div className="icon-big text-center">
                        <i className="nc-icon nc-single-02 text-danger" />
                      </div>
                    </Col>
                    <Col xs={7} md={8}>
                      <div className="numbers">
                        <p className="card-category">Users</p>
                        <CardTitle tag="p">{this.state.data !== null ? this.state.data.Customer : 0}</CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <Stats>
                    {[
                      {
                        i: "far fa-clock",
                        t: "Last Year"
                      }
                    ]}
                  </Stats>
                </CardFooter>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col xs={5} md={4}>
                      <div className="icon-big text-center">
                        <i className="nc-icon nc-money-coins text-success" />
                      </div>
                    </Col>
                    <Col xs={7} md={8}>
                      <div className="numbers">
                        <p className="card-category">Sales</p>
                        <CardTitle tag="p">Rp {this.state.data !== null ? this.formatuang(this.state.data.sales[0].total) : 0}</CardTitle>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <Stats>
                    {[
                      {
                        i: "far fa-calendar",
                        t: "Last Year"
                      }
                    ]}
                  </Stats>
                </CardFooter>
              </Card>
            </Col>

            {/* <Col xs={12} sm={6} md={6} lg={3}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs={5} md={4}>
                    <div className="icon-big text-center">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col xs={7} md={8}>
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="p">0</CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <Stats>
                  {[
                    {
                      i: "fas fa-sync-alt",
                      t: "Update now"
                    }
                  ]}
                </Stats>
              </CardFooter>
            </Card>
          </Col> */}
          </Row>
          {/* <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle>Users Behavior</CardTitle>
                <p className="card-category">24 Hours performance</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <Stats>
                  {[
                    {
                      i: "fas fa-history",
                      t: " Updated 3 minutes ago"
                    }
                  ]}
                </Stats>
              </CardFooter>
            </Card>
          </Col>
        </Row> */}
          <Row>
            <Col xs={12} sm={12} md={4}>
              <Card>
                <CardHeader>
                  <CardTitle>Produk Terlaris</CardTitle>
                  {/* <p className="card-category">Last Campaign Performance</p> */}
                </CardHeader>
                <CardBody>

                  {this.state.data !== null ? (
                    <Terlaris data={this.state.data !== null ? this.state.data.terlaris : null} />
                  ) : (<><BulletList /><BulletList /></>)}

                </CardBody>
                <CardFooter>

                </CardFooter>
              </Card>
            </Col>


            <Col xs={12} sm={12} md={8}>
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle>Jumlah Order Per Bulan</CardTitle>
                  <p className="card-category">Data dengan status pembayaran berhasil</p>
                </CardHeader>
                <CardBody>
                  <Line
                    data={this.state.orderChartData.data}
                    options={this.state.orderChartData.options}
                    width={400}
                    height={100}
                  />
                </CardBody>
                <CardFooter>
                  <div className="chart-legend" style={{display:'flex',justifyContent:'space-between'}}>
                    <span><i className="fa fa-circle text-warning" /> Jumlah Order Tahun Ini</span>
                    <span><i className="fa fa-circle" style={{color:'grey'}} /> Jumlah Order Tahun Lalu </span>                    
                </div>
                  <hr />
                  <Stats>
                    {[
                      {
                        i: "fas fa-check",
                        t: " Data information in 1 year"
                      }
                    ]}
                  </Stats>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
        <ToastContainer />
      </>
    );
  }
}

export default Dashboard;
