// const express = require('express');
// const path = require('path');
// const { open } = require('sqlite');
// const sqlite3 = require('sqlite3');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');

// const app = express();
// app.use(express.json());
// app.use(cors());

// let dbUser = null;
// let dbAdmin = null;
// let dbcomplaint = null;

// const initializeDBs = async () => {
//   try {
//     dbUser = await open({
//       filename: path.join(__dirname, 'people_data.db'),
//       driver: sqlite3.Database,
//     });

//     dbAdmin = await open({
//       filename: path.join(__dirname, 'dummy_admins.db'),
//       driver: sqlite3.Database,
//     });
//     dbcomplaint = await open({
//       filename: path.join(__dirname, 'complaint_form.db'),
//       driver: sqlite3.Database,
//     });

//     app.listen(3000, () => {
//       console.log('✅ Server running at http://localhost:3000');
//     });
//   } catch (e) {
//     console.error('❌ DB Error:', e.message);
//     process.exit(1);
//   }
// };

// initializeDBs();

// // People login 
// // app.post('/auth_user', async (request, response) => {
// //   try {
// //     const { aadharNo, password } = request.body;

// //     console.log("Request received:", request.body);

// //     if (!aadharNo || !password) {
// //       return response.status(400).send({ succeeded: false, error: 'Missing fields' });
// //     }

// //     const checkPersonQuery = SELECT * FROM people WHERE aadhaarNo = ?;;
// //     const person = await db.get(checkPersonQuery, [aadharNo]);

// //     if (person) {
// //       const expected = person.aadhaarNo.slice(8, 12);
// //       const isValid = password === expected;

// //       if (isValid) {
// //         const payload = { aadharNo: person.aadhaarNo };
// //         const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');

// //         return response.status(200).send({ succeeded: true, jwtToken });
// //       } else {
// //         return response.status(200).send({ succeeded: false, error: 'Invalid password' });
// //       }
// //     } else {
// //       return response.status(200).send({ succeeded: false, error: 'User not found' });
// //     }
// //   } catch (error) {
// //     console.error("🔥 /auth_user error:", error.message);
// //     return response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
// //   }
// // });
// let aadhar_no_storing = null;
// app.post('/auth_user', async (request, response) => {
//   try {
//     const { aadharNo, password } = request.body;

//     const person = await dbUser.get('SELECT * FROM people WHERE aadhaarNo = ?', [aadharNo]);
//     aadhar_no_storing = person.aadhaarNo;

//     if (person && password === person.aadhaarNo.slice(8, 12)) {
//       const token = jwt.sign({ aadharNo }, 'MY_SECRET');
//       response.send({ succeeded: true, jwtToken: token });
      
//     } else {
//       response.send({ succeeded: false, error: 'Invalid user credentials' });
//     } 
//   } catch (error) {
//     console.error('/auth_user error:', error.message);
//     response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
//   }

 
// });

// // Admin login
// var admin_location = null;
// app.post('/auth_admin', async (request, response) => {
//   try {
//     const { email, password } = request.body;

//     const admin = await dbAdmin.get('SELECT * FROM admins WHERE Email = ?', [email]);
//     admin_location = admin.Location;
//     console.log("Admin request received:", request.body);
//     if (password === admin.Password) {
//       const token = jwt.sign({ email }, 'MY_SECRET');
//       response.send({ succeeded: true, jwtToken: token });
//     } else {
//       console.log("Invalid admin credentials:", password, admin.Password);
//       response.send({ succeeded: false, error: 'Invalid admin credentials' });
//     }
//   } catch (error) {
//     console.error('/auth_admin error:', error.message);
//     response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
//   }
// });

// // Create a new complaint by user

// app.post('/complaint_user', async (req, res) => {
//   try {
//     const {
//       Full_Name,
//       Contact_Number,
//       Email_Address,
//       Category,
//       Address,
//       Complaint_Title,
//       Incident_Location,
//       Detailed_Description
//     } = req.body;

//     const createComplaintQuery = `
//       INSERT INTO complaint_form (
//         Full_Name,
//         Contact_Number,
//         Email_Address,
//         Category,
//         Address,
//         Complaint_Title,
//         Incident_Location,
//         Detailed_Description
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     await dbcomplaint.run(createComplaintQuery, [
//       Full_Name,
//       Contact_Number,
//       Email_Address,
//       Category,
//       Address,
//       Complaint_Title,
//       Incident_Location,
//       Detailed_Description,
//     ]);

//     res.send({ succeeded: true });
//   } catch (e) {
//     console.error("/complaint_user error:", e);
//     res.status(500).send({ succeeded: false, error: "Internal Server Error" });
//   }
// });


// // get all complaints
// app.get('/get_complaints', async (request, response) => {
//   try {
//     const complaints = await dbcomplaint.all('SELECT * FROM complaint_form');
//     response.send({ succeeded: true, complaints });
//   } catch (error) {
//     console.error("/get_complaints error:", error.message);
//     response.status(500).send({ succeeded: false, error: "Internal Server Error" });
//   }
// });


// // Get complaints by Aadhaar number 


// app.get('/get_complaints_by_aadhar', async (request, response) => {
//   try {
//     const aadhaarNo = aadhar_no_storing;

//     if (!aadhaarNo) {
//       return response.status(400).send({ succeeded: false, error: 'Aadhaar number is required' });
//     }

//     const complaints = await dbcomplaint.all('SELECT * FROM complaint_form WHERE aadhaarNo = ?', [aadhaarNo]);
//     response.send({ succeeded: true, complaints });
//   } catch (error) {
//     console.error("/get_complaints_by_aadhar error:", error.message);
//     response.status(500).send({ succeeded: false, error: "Internal Server Error" });
//   }
// });





// // spefic complains for admin 

// app.get('/get_complaints_by_admin', async (request, response) => {
//   try {
//     const complaints = await dbcomplaint.all('SELECT * FROM complaint_form where status = "pending" and Location = ?', [admin_location]);
//     response.send({ succeeded: true, complaints });
//   } catch (error) {
//     console.error("/get_complaints_by_admin error:", error.message);
//     response.status(500).send({ succeeded: false, error: "Internal Server Error" });
//   }
// });



// // Update complaint status by admin
// app.put('/update_complaint_status', async (request, response) => {
//   try {
//     const { complaintId} = request.body;

//     if (!complaintId ) {
//       return response.status(400).send({ succeeded: false, error: 'Complaint ID required' });
//     }

//     const updateStatusQuery = 'UPDATE complaint_form SET status = ? WHERE id = ?';
//     await dbcomplaint.run(updateStatusQuery, [status, complaintId]);

//     response.send({ succeeded: true, message: "Complaint status updated successfully" });
//   } catch (error) {
//     console.error("/update_complaint_status error:", error.message);
//     response.status(500).send({ succeeded: false, error: "Internal Server Error" });
//   }
// });





// //#############################################################################################3
// // const express = require('express');
// // const path = require('path');
// // const { open } = require('sqlite');
// // const sqlite3 = require('sqlite3');
// // const cors = require('cors');
// // const jwt = require('jsonwebtoken');

// // const app = express();
// // app.use(express.json());
// // app.use(cors());

// // let dbUser = null;
// // let dbAdmin = null;

// // const initializeDBs = async () => {
// //   try {
// //     dbUser = await open({
// //       filename: path.join(__dirname, 'people_data.db'),
// //       driver: sqlite3.Database,
// //     });

// //     dbAdmin = await open({
// //       filename: path.join(__dirname, 'dummy_admins.db'),
// //       driver: sqlite3.Database,
// //     });

// //     app.listen(3000, () => {
// //       console.log('✅ Server running at http://localhost:3000');
// //     });
// //   } catch (e) {
// //     console.error('❌ DB Error:', e.message);
// //     process.exit(1);
// //   }
// // };

// // initializeDBs();

// // // People login 
// // // app.post('/auth_user', async (request, response) => {
// // //   try {
// // //     const { aadharNo, password } = request.body;

// // //     console.log("Request received:", request.body);

// // //     if (!aadharNo || !password) {
// // //       return response.status(400).send({ succeeded: false, error: 'Missing fields' });
// // //     }

// // //     const checkPersonQuery = `SELECT * FROM people WHERE aadhaarNo = ?;`;
// // //     const person = await db.get(checkPersonQuery, [aadharNo]);

// // //     if (person) {
// // //       const expected = person.aadhaarNo.slice(8, 12);
// // //       const isValid = password === expected;

// // //       if (isValid) {
// // //         const payload = { aadharNo: person.aadhaarNo };
// // //         const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');

// // //         return response.status(200).send({ succeeded: true, jwtToken });
// // //       } else {
// // //         return response.status(200).send({ succeeded: false, error: 'Invalid password' });
// // //       }
// // //     } else {
// // //       return response.status(200).send({ succeeded: false, error: 'User not found' });
// // //     }
// // //   } catch (error) {
// // //     console.error("🔥 /auth_user error:", error.message);
// // //     return response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
// // //   }
// // // });

// // app.post('/auth_user', async (request, response) => {
// //   try {
// //     const { aadharNo, password } = request.body;

// //     const person = await dbUser.get('SELECT * FROM people WHERE aadhaarNo = ?', [aadharNo]);

// //     if (person && password === person.aadhaarNo.slice(8, 12)) {
// //       const token = jwt.sign({ aadharNo }, 'MY_SECRET');
// //       response.send({ succeeded: true, jwtToken: token });
// //     } else {
// //       response.send({ succeeded: false, error: 'Invalid user credentials' });
// //     }
// //   } catch (error) {
// //     console.error('/auth_user error:', error.message);
// //     response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
// //   }
// // });



// // // Admin authentication route
// // // app.post('/auth_admin', async (request, response) => {
// // //   try {
// // //     const { email, password } = request.body;

// // //     console.log("Request received:", request.body);

// // //     if (!email || !password) {
// // //       return response.status(400).send({ succeeded: false, error: 'Missing fields' });
// // //     }

// // //     const checkPersonQuery = `SELECT * FROM admin WHERE email = ?;`;
// // //     const person = await db.get(checkPersonQuery, [email]);

// // //     if (person) {
// // //       const expected = person.password;
// // //       const isValid = password === expected;

// // //       if (isValid) {
// // //         const payload = { email: person.email };
// // //         const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');

// // //         return response.status(200).send({ succeeded: true, jwtToken });
// // //       } else {
// // //         return response.status(200).send({ succeeded: false, error: 'Invalid password' });
// // //       }
// // //     } else {
// // //       return response.status(200).send({ succeeded: false, error: 'User not found' });
// // //     }
// // //   } catch (error) {
// // //     console.error("🔥 /auth_user error:", error.message);
// // //     return response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
// // //   }
// // // });


// // app.post('/auth_admin', async (request, response) => {
// //   try {
// //     const { email, password } = request.body;

// //     const admin = await dbAdmin.get('SELECT * FROM admins WHERE Email = ?', [email]);
// //     console.log("Admin request received:", request.body);
// //     if (password === admin.Password) {
// //       const token = jwt.sign({ email }, 'MY_SECRET');
// //       response.send({ succeeded: true, jwtToken: token });
// //     } else {
// //       console.log("Invalid admin credentials:", password, admin.Password);
// //       response.send({ succeeded: false, error: 'Invalid admin credentials' });
// //     }
// //   } catch (error) {
// //     console.error('/auth_admin error:', error.message);
// //     response.status(500).send({ succeeded: false, error: 'Internal Server Error' });
// //   }
// // });


const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

let dbUser = null;
let dbAdmin = null;
let dbComplaint = null;

// Initialize Databases
const initializeDBs = async () => {
  try {
    dbUser = await open({
      filename: path.join(__dirname, 'people_data.db'),
      driver: sqlite3.Database,
    });

    dbAdmin = await open({
      filename: path.join(__dirname, 'dummy_admins.db'),
      driver: sqlite3.Database,
    });

    dbComplaint = await open({
      filename: path.join(__dirname, 'complaint_form.db'),
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log('✅ Server running at http://localhost:3000');
    });

  } catch (e) {
    console.error('❌ DB Initialization Error:', e.message);
    process.exit(1);
  }
};

initializeDBs();


// ======================
// USER LOGIN
// ======================

app.post('/auth_user', async (req, res) => {
  try {
    const { aadharNo, password } = req.body;

    if (!aadharNo || !password) {
      return res.status(400).send({ succeeded: false, error: "Missing credentials" });
    }

    const person = await dbUser.get(
      'SELECT * FROM people WHERE aadhaarNo = ?',
      [aadharNo]
    );

    if (!person) {
      return res.send({ succeeded: false, error: "User not found" });
    }

    const expectedPassword = person.aadhaarNo.slice(8, 12);

    if (password !== expectedPassword) {
      return res.send({ succeeded: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ aadharNo }, 'MY_SECRET', { expiresIn: '1h' });

    res.send({ succeeded: true, jwtToken: token });

  } catch (error) {
    console.error("/auth_user error:", error.message);
    res.status(500).send({ succeeded: false, error: "Internal Server Error" });
  }
});


// ======================
// ADMIN LOGIN
// ======================

app.post('/auth_admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ succeeded: false, error: "Missing credentials" });
    }

    const admin = await dbAdmin.get(
      'SELECT * FROM admins WHERE Email = ?',
      [email]
    );

    if (!admin) {
      return res.send({ succeeded: false, error: "Admin not found" });
    }

    if (password !== admin.Password) {
      return res.send({ succeeded: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, location: admin.Location },
      'MY_SECRET',
      { expiresIn: '1h' }
    );

    res.send({ succeeded: true, jwtToken: token });

  } catch (error) {
    console.error("/auth_admin error:", error.message);
    res.status(500).send({ succeeded: false, error: "Internal Server Error" });
  }
});


// ======================
// CREATE COMPLAINT
// ======================

app.post('/complaint_user', async (req, res) => {
  try {
    const {
      Full_Name,
      Contact_Number,
      Email_Address,
      Category,
      Address,
      Complaint_Title,
      Incident_Location,
      Detailed_Description,
      aadhaarNo
    } = req.body;

    const query = `
      INSERT INTO complaint_form (
        Full_Name,
        Contact_Number,
        Email_Address,
        Category,
        Address,
        Complaint_Title,
        Incident_Location,
        Detailed_Description,
        aadhaarNo,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await dbComplaint.run(query, [
      Full_Name,
      Contact_Number,
      Email_Address,
      Category,
      Address,
      Complaint_Title,
      Incident_Location,
      Detailed_Description,
      aadhaarNo,
      "pending"
    ]);

    res.send({ succeeded: true });

  } catch (error) {
    console.error("/complaint_user error:", error.message);
    res.status(500).send({ succeeded: false, error: "Internal Server Error" });
  }
});


// ======================
// GET ALL COMPLAINTS
// ======================

app.get('/get_complaints', async (req, res) => {
  try {
    const complaints = await dbComplaint.all(
      'SELECT * FROM complaint_form'
    );

    res.send({ succeeded: true, complaints });

  } catch (error) {
    console.error("/get_complaints error:", error.message);
    res.status(500).send({ succeeded: false, error: "Internal Server Error" });
  }
});


// ======================
// GET COMPLAINTS BY AADHAAR
// ======================

app.get('/get_complaints_by_aadhar/:aadhaarNo', async (req, res) => {
  try {
    const { aadhaarNo } = req.params;

    const complaints = await dbComplaint.all(
      'SELECT * FROM complaint_form WHERE aadhaarNo = ?',
      [aadhaarNo]
    );

    res.send({ succeeded: true, complaints });

  } catch (error) {
    console.error("/get_complaints_by_aadhar error:", error.message);
    res.status(500).send({ succeeded: false, error: "Internal Server Error" });
  }
});


// ======================
// UPDATE COMPLAINT STATUS
// ======================

app.put('/update_complaint_status', async (req, res) => {
  try {
    const { complaintId, status } = req.body;

    if (!complaintId || !status) {
      return res.status(400).send({ succeeded: false, error: "Missing fields" });
    }

    await dbComplaint.run(
      'UPDATE complaint_form SET status = ? WHERE id = ?',
      [status, complaintId]
    );

    res.send({ succeeded: true, message: "Status updated successfully" });

  } catch (error) {
    console.error("/update_complaint_status error:", error.message);
    res.status(500).send({ succeeded: false, error: "Internal Server Error" });
  }
});
