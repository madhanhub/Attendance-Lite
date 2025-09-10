const express=require('express')
const app=express()
const mongoose=require('mongoose')
const morgan=require('morgan')
const bodyparser=require('body-parser')
require('dotenv').config()
const jsonwebtoken=require('jsonwebtoken')
const ExcelJS=require('exceljs')


const user=require('./Schema/User')
const attendance=require('./Schema/Attendance')

const authorization=require('./Function/auth')
const cors=require('./Function/cors')

app.use(express.json())
app.use(bodyparser.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cors)

app.listen(5000,()=>{
    console.log("prot Run");

    mongoose.connect('mongodb://localhost:27017/')

    .then(()=>{
        conn =mongoose.connection
        console.log('DB Connect');
        
    })
    .catch(()=>{
        console.log("DB NOT Connect");
        
    })
    
})

app.get('/',async(req,res)=>{
    res.send('WELCOME')
})

//localhost  http://localhost:5000/

//User
// method: POST   route/new/user
app.post('/new/user',async(req,res)=>{
    try{
        const {name,email,password,isAdmin}=req.body
        const existingUser=await user.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'User already exist'})
        }
        const newUser=new user({name,email,password,isAdmin}).save()
        res.status(200).json({message:'User Register',data:newUser})
    }catch(error){
        res.status(500).json({message:'User not register'})
    }
})


// method: POST   route/login

app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        const userLogin=await user.findOne({
            email,password
        })
        if(userLogin){
            {
                user_token=await jsonwebtoken.sign({id:userLogin.id,name:userLogin.name,email:userLogin.email},process.env.SECRET)
                 res.setHeader('user_token',user_token)
                res.setHeader('id',userLogin.id)
                res.setHeader('email',userLogin.email)
                res.setHeader('name',userLogin.name)
               

                res.status(200).json({message:'Tenant Login Successfully',user_token,data:userLogin})
            }
        }
       // res.status(200).json({message:'User login',data:userLogin})
    }catch(error){
         res.status(500).json({message:'User not register'})
    }
})

// method: POST   route/inTime

app.post('/inTime',async(req,res)=>{
    try{
        const {userId}=req.body
        // const {userId}=req.id
        const istDate = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const intime=new attendance({
            userId,
            inTime:istDate,
            date:new Date().toISOString().split('T')[0]
        })
        await intime.save()
     res.status(200).json({message:'In time updated',data:intime})
    }
    catch(error){
        res.status(500).json({message:'intime not checked'})
    }
})

// method: POST   route/outTime

app.post('/outTime',authorization,async(req,res)=>{
    try{
        const {userId}=req.id
        const istNow = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const today=new Date().toISOString().split('T')[0]
        const log = await attendance.findOne({ date: today });

         log.outTime = istNow;

    // Calculate total time
    const inTime = new Date(log.inTime);
    const outTime = istNow
    
    const totalHours = ((outTime - inTime) / (1000 * 60 * 60)).toFixed(2);
    log.totalHours = totalHours;
    


    await log.save();
     res.status(200).json({message:'Out Time updated'})
    }
    catch(error){
        res.status(500).json({message:'Out time not checked'})
    }
})

// method: POST   route/breakStart

app.post('/breakStart',authorization,async(req,res)=>{
    
    try{

        const {userId}=req.id
         const istNow = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const  today=new Date().toISOString().split('T')[0]
        const log = await attendance.findOne({  date: today });
       

        log.breakStart = istNow;
        await log.save()
        res.status(200).json({ message: 'Break start marked' });

    }catch(error){
        res.status(500).json({message:'break not updated'})
    }
})

// method: POST   route/breakEnd

app.post('/breakEnd',authorization,async(req,res)=>{
    try{
       const {userId}=req.id
        const istNow = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
       const today=new Date().toISOString().split('T')[0]

       const log=await attendance.findOne({date:today})
        log.breakEnd = istNow;
       
       
        const breakStart = new Date(log.breakStart);
    const breakEnd = istNow
    
    const totalHours = ((breakEnd - breakStart) / (1000 * 60 * 60)).toFixed(2);
    log.totalHours = totalHours;

    await log.save();
    res.status(200).json({message:'Break updated'})

    }catch(error){
        res.status(500).json({message:'Break end Not updated'})
    }
})

// method: POST   route/userAttendance

app.post('/userAttendance',async(req,res)=>{
    try{
        const {userId}=req.body
         const logs = await attendance.findOne({ userId}).sort({ date: -1 });
        // console.log(logs);
         
    res.json(logs);
    console.log(logs);
    res.status(200).json({message:"User log get"})
    }catch(error){
 res.status(500).json({message:'User log not get'})
    }
})

// method: POST   route/excel

app.get('/excel',async(req,res)=>{
    try{
            const { userId } = req.body;
    const logs = await attendance.find({ userId }).sort({ date: -1 });

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No attendance data found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'In Time', key: 'inTime', width: 20 },
      { header: 'Out Time', key: 'outTime', width: 20 },
      { header: 'Break Start', key: 'breakStart', width: 20 },
      { header: 'Break End', key: 'breakEnd', width: 20 },
      { header: 'Total Hours', key: 'totalHours', width: 20 },
    ];

    logs.forEach((log) => {
      worksheet.addRow({
        date: log.date,
        inTime: log.inTime,
        outTime: log.outTime,
        breakStart: log.breakStart,
        breakEnd: log.breakEnd,
        totalHours: log.totalHours,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
    }catch(error){
        res.status(500).json({message:'Excel not downloaded'})
    }
})