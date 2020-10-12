import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  level:string;
  users:any;
  // usuario = {user:'', nombre:''};
  nuevoUser = {user:"", pass:"", tipo:"", nombre:""};
  // usuarios: any =[{user:"", pass:"", tipo:"", nombre:""}];

  tmpUser ={user:"", pass:"", tipo:"", nombre:""};

  constructor(private datos:DatosService, private router:Router, private msg:ToastrService) { }

  ngOnInit(): void {
    this.level = this.datos.getCuenta().level;
    this.llenarUsuarios();
  }
  
  llenarUsuarios(){
    this.datos.getUsuarios().subscribe(resp => {
      this.users = resp;
      //console.log(resp);
    }, error => {
      console.log(error);
    })
  }

  agregarUsuario(){
    if(this.nuevoUser.user == '' && this.nuevoUser.pass == '' && this.nuevoUser.tipo=='' && this.nuevoUser.nombre==''){
      this.msg.error("Algun campo esta vacio");
      return;
    }
    this.datos.postUsuarios(this.nuevoUser).subscribe(resp => {
      if (resp['result']=='ok'){
      let usuario = JSON.parse(JSON.stringify(this.nuevoUser));
      this.users.push(usuario);
      this.nuevoUser.user='';
      this.nuevoUser.pass='';
      this.nuevoUser.tipo='';
      this.nuevoUser.nombre='';
      this.msg.success("Se ha agregado exisotamente");
      }else{
        this.msg.error("No se ha podido agregar el usuario");
      }
    }, error => {
      console.log(error);
    });
  }

  temporalUsuario(useer){
    // console.log(useer);
    this.tmpUser = JSON.parse(JSON.stringify(useer));
  }

  guardarCambios(){
    this.datos.putUsuarios(this.tmpUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.users.indexOf(this.users.find(User => User.user == this.tmpUser.user));
        this.users[i].pass = this.tmpUser.pass;
        this.users[i].tipo = this.tmpUser.tipo;
        this.users[i].nombre = this.tmpUser.nombre;
        this.msg.success("El Usuario se guardo correctamente.");
      }else{
        this.msg.error("El Usuario no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }

  confirmarEliminar(){
    this.datos.deleteUsuarios(this.tmpUser).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.users.indexOf(this.users.find( User => User.user == this.tmpUser.user));
        this.users.splice(i,1);
        this.msg.success("El Usuario se elimino correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido eliminar.");
      }
    }, error => {
      console.log(error);
    });
  }

}
 