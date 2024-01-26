import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../store/auth';

export default function User() {
  const { state } = useAuth();
  const { contract } = state;
  const scannerRef = useRef();
  const [res, setRes] = useState("");
  const [Result, setResult] = useState({
    prd_id: null,
    prd_name: null,
    batch_no: null,
    expirationDate: null,
    manufacturingDate: null
  });

  useEffect(() => {
    const onScanSuccess = async (decodedText, decodedResult) => {
      isFake();
    };
    const scannerId = 'qrScanner';
    scannerRef.current.id = scannerId;

    const htmlScanner = new Html5QrcodeScanner(scannerId, { fps: 10, qrbos: 250 });
    htmlScanner.render(onScanSuccess);

    return () => {
      htmlScanner.clear();
    };
  }, []);

  const isFake = async () => {
    try {
      const [real, productInfo] = await contract.isReal(res);
      console.log("Product info: ", productInfo);

      const expirationTimestamp = productInfo.expirationDate.timestamp;
      const manufacturingTimestamp = productInfo.manufacturingDate.timestamp;

      console.log("Expiration Timestamp: ", expirationTimestamp);
      console.log("Manufacturing Timestamp: ", manufacturingTimestamp);

      if (real) {
        alert("Product is Real");
        setResult({
          prd_id: productInfo[0],
          prd_name: productInfo[1],
          batch_no: productInfo[2],
          expirationDate: new Date(productInfo.expirationDate.timestamp * 1000).toLocaleString(),
          manufacturingDate: new Date(productInfo.manufacturingDate.timestamp * 1000).toLocaleString()
        });
      } else {
        alert("Product is Fake");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="input-group mb-4">
          <input type="text" className="form-control" placeholder="Enter Product ID" aria-label="Recipient's username" aria-describedby="basic-addon2" value={res} onChange={(e) => setRes(e.target.value)} />
          <span className="input-group-text btn btn-outline-primary ms-2 fw-semibold" id="basic-addon2" onClick={isFake}>Detect</span>
        </div>
        <h4 className='text-center'>OR</h4>
        <div style={{ width: '400px', marginInline: "auto" }} ref={scannerRef}></div>
        <div className='mt-5'>
        {Result.prd_id}
        {Result.prd_name}
        {Result.batch_no}
        {Result.expirationDate}
        {Result.manufacturingDate}
        </div>
      </div>

      <style>
        {`
          .container {
            height: 300px; 
            width: 600px; 
          }
        `}
      </style>
    </>
  );
}
