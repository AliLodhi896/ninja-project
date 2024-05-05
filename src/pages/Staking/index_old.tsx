import React from 'react'
import Ninja_icon from '../../assets/images/Ninja_icon.png'
import xNinja_icon from '../../assets/images/xNinja_icon.png'
import logo_dark from '../../assets/img/Ninja_Logo_DarkVer.png'
import Button from 'react-bootstrap/Button'
export default function Staking() {
    return (
        <>
            <div className="main container mainContainer" id="content">
                <div
                    className="row justify-content-sm-center justify-content-md-center"
                    style={{ textAlign: 'center' }}
                >
                    <div className="col-lg-8">
                        <img className="indexImage" src={logo_dark} />
                        <h1 className="subTitle">Ninja Staking Coming Soon</h1>

                    </div>
                </div>
                <div className="row justify-content-sm-center justify-content-md-center" style={{ paddingTop: '20px' }}>
                    <div className="col-lg-8">
                        <div className="row dashboard overview justify-content-sm-center" style={{ marginTop: '30px' }}>
                            <div className="col-lg-6">
                                <div className="card centered">
                                    <div className="card-header">xNinja</div>
                                    <div className="card-body">
                                        <div className="vaultImage">
                                            <img src={xNinja_icon} />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <strong>Available:</strong>
                                        <br />
                                        <span id="totalSupply"> 0.0000
                      {/* {Number(XZwapBal).toFixed(4)} */}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <Button disabled={true} className="Zwap-btn-card button" >
                                            Convert to xNinja
                    </Button>
                                        {/* {Number(XZwapBal) <= 0 ? (
                  <>
                     <Button disabled={true} className="Zwap-btn-card button" >
                     Convert to xNinja
                    </Button>
                   
                  </>
                ) : (
                  <>
                    <Button  className="Zwap-btn-card button" onClick={showMadalLeft}>
                    Convert to xNinja
                    </Button>
                  </>
                )} */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="card centered">
                                    <div className="card-header">NINJA</div>
                                    <div className="card-body">
                                        <div className="vaultImage">
                                            <img src={Ninja_icon} />
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <strong>Available:</strong>
                                        <br />
                                        <span id="tokenBalance"> 0.0000
                      {/* {Number(tokenBalance).toFixed(4)} */}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <Button disabled={true} className="Zwap-btn-card button">
                                            Convert To xNINJA
                          </Button>
                                        {/* <Button disabled={true} className="Zwap-btn-card button" onClick={approveBtn}>
                          Convert To xNINJA
                          </Button> */}
                                        {/* {allowance == 0 ? (
                      <>
                        <Button className="Zwap-btn-card button" onClick={approveBtn} disabled={btnStatus}>
                          {btnStatus? <Spinner as="span" animation="border" role="status" aria-hidden="true" /> : 'Approve To xNINJA'}
                        </Button>
                      </>
                    ) : (
                      <>
                        {Number(tokenBalance) <= 0 ? (
                          <Button disabled={true} className="Zwap-btn-card button" onClick={approveBtn}>
                          Convert To xNINJA
                          </Button>
                        ) : (
                          <Button className="Zwap-btn-card button" onClick={showMadalRight}>
                          Convert To xNINJA
                          </Button>
                        )}
                      </>
                    )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
