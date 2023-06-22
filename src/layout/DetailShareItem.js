import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Table.css";
import TableBootstrap from "react-bootstrap/Table";
import db from "../database/firebase";
import { Modal, Button, Card } from "react-bootstrap";
import {
  collection,
  query,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  orderBy,
} from "firebase/firestore";

export default function DetailItemShare() {
  const [item, setItem] = useState([]);

  let { state } = useLocation();
  const Get = async () => {
    const myDoc = query(collection(db, "itemShare_his"));
    var val = [];
    onSnapshot(myDoc, (snapshot) => {
      // setItem(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      snapshot.docs.forEach((doc) => {
        if (state.user_id === doc.data().user_id) {
          val.push(doc.data());
          console.log(state.user_id === doc.data().user_id);
        }
      });
      console.log("v", val);
      setItem(val);
    });
  };
  console.log("props", state);
  useEffect(() => {
    Get();
  }, []);

  var arry = item.length;
  console.log(arry);

  return (
    <div className="App">
      <div className="container">
        <Card className="card-title">
          <Card.Body>Item Share All {arry} </Card.Body>
        </Card>

        <TableBootstrap striped bordered hover>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Item</th>
              <th scope="col">Num</th>
              <th scope="col">Unit</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          {item.map((item, i) => {
            return (
              <tbody key={i}>
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td>
                    <img
                      src={item.props.category_img.uri}
                      alt="avatar"
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>{item.props.category_name}</td>
                  <td>{item.props.category_num}</td>
                  <td>{item.props.category_unit}</td>
                  <td>
                    {new Date(item.dateTime.date.seconds * 1000).toDateString()}
                  </td>
                  <td>
                    {new Date(
                      item.dateTime.time.seconds * 1000
                    ).toLocaleTimeString()}
                    {" - "}
                    {new Date(
                      item.dateTime.timeEnd.seconds * 1000
                    ).toLocaleTimeString()}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </TableBootstrap>
      </div>
    </div>
  );
}
