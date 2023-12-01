import { Router } from "express";
export const router=Router(); //Exporting this router so it can invoked from app.js

router.get('/', (req, res)=>{
  res.status(200).render('home')
})

router.get('/chat', (req, res)=>{
  res.status(200).render('chat')
})