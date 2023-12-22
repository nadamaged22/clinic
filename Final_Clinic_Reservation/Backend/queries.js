const Pool = require("pg").Pool;
const pool =require("./database/db")

const getUsers = async (req, res, next) => {
    const response = await pool.query("SELECT * FROM users ORDER BY id ASC");

    res.status(200).json(response.rows);
};

const signUp = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    console.log(role)
    // if(role !="doctor" || role!="patient"){
    //     return res.status(406).json("please enter a valid role type!")
    // }

    const checkIfExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(checkIfExists.rowCount!=0){
        return res.status(409).json("this email already exists")
    }

    await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ",[name, email, password, role])

    res.status(200).json("signed-up successfully");
};

const signIn = async(req,res,next)=>{
    const {email,password} = req.body
    const checkIfUserExists = await pool.query('SELECT name,id,role FROM users WHERE email = $1 AND password = $2', [email,password]);
    if(checkIfUserExists.rows==0){
        return res.status(404).json("in-valid credentials, please try again!")
    }

    res.status(200).json(checkIfUserExists.rows[0])
}

const addSlot = async(req,res,next)=>{
    const {doctorId,date,hour} = req.body
    console.log(doctorId,date,hour)
    const checkIfDoctorExists = await pool.query("SELECT * FROM Users WHERE id = $1 AND role = 'doctor' ",[doctorId])
    console.log(checkIfDoctorExists.rowCount)
    if(!checkIfDoctorExists.rowCount){
        return res.status(432).json("there is not doctor with that id!")
    }

    const checkSlot = await pool.query("SELECT * FROM Appointments WHERE Date = $1 AND Hour = $2 AND createdBy = $3",[date,hour,doctorId])
    if(checkSlot.rowCount){
        return res.status(409).json("this doctor already has an appointment at this time!")
    }

    await pool.query("INSERT INTO Appointments (createdBy,Date,Hour) VALUES ($1,$2,$3)",[doctorId,date,hour])
    return res.status(200).json("appointment added successfully!")
} 

const viewSlots = async(req,res,next)=>{
    const {doctorId} = req.body

    const checkIfDoctorExists = await pool.query("SELECT * FROM Users WHERE id = $1 AND role = 'doctor' ",[doctorId])
    if(!checkIfDoctorExists){
        return res.status(404).json("there is not doctor with that id!")
    }
    console.log(doctorId)
    const Slot = await pool.query("SELECT Date,Hour FROM Appointments WHERE createdBy = $1",[doctorId])
    if(!Slot.rowCount){
        return res.status(404).json("this doctor doesn't have any appointments!")
    }

    return res.status(200).json(Slot.rows)
}

const viewAvailableSlots = async(req,res,next)=>{
    const {doctorId} = req.body
    
    const checkIfDoctorExists = await pool.query("SELECT * FROM Users WHERE id = $1 AND role = 'doctor' ",[doctorId])
    if(!checkIfDoctorExists.rowCount){
        return res.status(404).json("there is not doctor with that id!")
    }

    const avialableSlots = await pool.query("SELECT id,Date,Hour FROM Appointments WHERE createdBy = $1 AND occupiedBy IS NULL",[doctorId]) 
    if(!avialableSlots.rowCount){
        return res.status(404).json("this doctor doesn't have any available slots")
    }

    return res.status(200).json(avialableSlots.rows)
}

const reserveSlot = async(req,res,next)=>{
    const {patientId,slotId} = req.body

    const checkIfPatientExists = await pool.query("SELECT * FROM Users WHERE id = $1 AND role = 'patient' ",[patientId])
    if(!checkIfPatientExists.rowCount){
        return res.status(404).json("there is not patient with that id!")
    }

    const checkSlotFree = await pool.query("SELECT * FROM Appointments WHERE occupiedBy IS NULL AND id = $1",[slotId])
    console.log(checkSlotFree.rowCount)
    if(!checkSlotFree.rowCount){
        return res.status(409).json("this slot is already taken!")
    }

    await pool.query("UPDATE Appointments SET occupiedBy = $1 WHERE id = $2",[patientId,slotId])

    return res.status(200).json("reserved successfully")
}

const getReservations = async(req,res,next)=>{
    const {patientId} = req.body

    const checkIfPatientExists = await pool.query("SELECT * FROM Users WHERE id = $1 AND role = 'patient' ",[patientId])
    if(!checkIfPatientExists.rowCount){
        return res.status(404).json("there is not patient with that id!")
    }

    const mySlots = await pool.query("SELECT id,Date,Hour,createdby FROM Appointments WHERE occupiedBy = $1",[patientId])
    const doctors = await pool.query("SELECT createdBy FROM Appointments WHERE occupiedBy = $1 ",[patientId])
    console.log(doctors.rows)
    let doctorsArray = []
    
    for (const doctor of doctors.rows) {
        let kiko = await pool.query("SELECT name FROM Users WHERE id = $1 ",[doctor.createdby])
        doctorsArray.push(kiko.rows[0])
    }
    console.log(doctorsArray)
    if(!mySlots.rowCount){
        return res.status(404).json("no reservations were found!")
    }


    return res.status(200).json({slots:mySlots.rows,doctors:doctorsArray})
}

// const getDoctorBySlot = async(req,res,next)=>{
//     const {createdby} = req.body

//     const 

// }

const updateReservation = async(req,res,next)=>{
    const {patientId, slotId,newSlotId} = req.body

    const checkIfReserved = await pool.query("SELECT * FROM Appointments WHERE occupiedBy = $1 AND id = $2",[patientId,slotId])
    if(!checkIfReserved.rowCount){
        return res.status(400).json("you don't have this slot reserved to update")
    }

    await pool.query("UPDATE Appointments SET occupiedBy = NULL WHERE id = $1",[slotId])

    const checkIfSlotAvailable = pool.query("SELECT * FROM Appointments WHERE id = $1 AND occupiedBy IS NULL",[newSlotId])
    if(!checkIfSlotAvailable){
        return res.status(404).json("this slot is not available!")
    }

    await pool.query("UPDATE Appointments SET occupiedBy = $1 WHERE id = $2",[patientId,newSlotId])

    return res.status(200).json("updated successfully!")
}

const cancelReservation = async(req,res,next)=>{
    const {patientId, slotId} = req.body
    
    const checkIfReserved = await pool.query("SELECT * FROM Appointments WHERE occupiedBy = $1 AND id = $2",[patientId,slotId])
    if(!checkIfReserved.rowCount){
        return res.status(400).json("you don't have this slot reserved to cancel")
    }

    await pool.query("UPDATE Appointments SET occupiedBy = NULL WHERE id = $1",[slotId])

    return res.status(200).json("reservation cancelled!")
}

const getDoctors = async(req,res,next)=>{
    
    const checkIfDoctorsExist = await pool.query("SELECT name,id FROM Users WHERE role = 'doctor' ")
    if(!checkIfDoctorsExist.rowCount){
        return res.status(404).json("you don't have this slot reserved to cancel")
    }
    
    return res.status(200).json(checkIfDoctorsExist.rows)
}

module.exports = {
    getUsers,
    signUp,
    signIn,
    addSlot,
    viewSlots,
    viewAvailableSlots,
    reserveSlot,
    getReservations,
    updateReservation,
    cancelReservation,
    getDoctors
};
