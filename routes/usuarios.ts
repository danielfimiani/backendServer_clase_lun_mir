import {Router, Request, Response} from 'express';
import { Usuario } from '../models/usuarios.model';
import bcrypt from 'bcrypt';
import Token from '../class/token';


const userRoutes = Router();

// userRoutes.get('/prueba',(req:Request, res:Response)=>{
//     res.json({
//         estado:'success',
//         mensaje: 'ok'
//     });
// });

userRoutes.post('/create', (req:Request, res:Response)=>{
    
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10)
    };

    Usuario.create(user).then(result=>{
        res.json({
            estado: "success",
            mensaje: result
        })
    })
    .catch(error=>{
        res.json({
            estado: "error",
            mensaje: error
        })
    });
});

userRoutes.post('/login', (req:Request, res:Response)=>{
    
    const body = req.body;

    Usuario.findOne({email: body.email},null,null,(error, result)=>{
        if(error){
            throw error
        }
        if(!result){
            res.json({
                estado:"success",
                mensaje: "Usuario no encontrado en la base de datos",
            })
        }
        if(result?.compararPassword(body.password)){

            const userToken = Token.getJwtToken({
                _id:result.id,
                nombre: result.nombre,
                avatar: result.avatar
            });


            res.json({
                estado: "success",
                token: userToken,
                mensaje: "usuario encontrado",
                data: result
            })
        }
    })
})

export default userRoutes;