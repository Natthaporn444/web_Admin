import React, { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";

export default function UserList() {
  const [user, setUser] = useState([]);
  const [user_name, setUser_name] = useState("");
  const Get = async () => {
    const myDoc = query(collection(db, "user"));
    onSnapshot(myDoc, (snapshot) =>
      setUser(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
    console.log(user);
  };

  var monthNamesThai = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤษจิกายน",
    "ธันวาคม",
  ];
  useEffect(() => {
    Get();
  }, []);

  var arry = user.length;
  console.log(arry);

  return (
    <div className="App">
      <div className="container">
        <Card className="card-title">
          <Card.Body>{arry} User</Card.Body>
        </Card>

        <TableBootstrap striped bordered hover>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Timestamp</th>
              <th scope="col">Score</th>
              <th scope="col">Score Item Share</th>
            </tr>
          </thead>
          {user.map((user, i) => {
            return (
              <tbody key={i}>
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td>{user.user_name}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(user.date_time.seconds * 1000).toDateString()}
                    {",  "}
                    {new Date(
                      user.date_time.seconds * 1000
                    ).toLocaleTimeString()}
                  </td>
                  <td>{user.score} points</td>
                  <td>
                    {user.scoreList} Item
                    <Link
                      className="see-btn"
                      to={`/detail/${user.id}`}
                      state={{ user_id: user.id }}
                      style={{ color: "#1B79DB" }}
                    >
                      see more
                    </Link>
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
