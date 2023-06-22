import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableBootstrap from "react-bootstrap/Table";

export default function Home() {

  return (
    <div>
       <div className="App">
       <TableBootstrap striped bordered hover>
            <thead>
            <tr>
                <th scope="col">User</th>
                <th scope="col">num</th>
            </tr>
            </thead>
            
            <tbody>
                <tr>
                <td>user</td>
                <td>
                    10
                </td>
                </tr>
            </tbody>
        </TableBootstrap>
      </div>
    </div>
    
  );
}