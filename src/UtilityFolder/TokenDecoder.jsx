import {jwtDecode} from "jwt-decode";
export const TokenDeconder = () => {
  const MyToken =localStorage.getItem('Token')?JSON.parse(localStorage.getItem("Token")).token:null;
  if(MyToken===null)return
  const decode=jwtDecode(MyToken)
  const role=decode?.[Object.keys(decode).find(u=>u.includes("role"))]
 
  const nameIdentifiyer=decode?.[Object.keys(decode).find(u=>u.includes("nameidentifier"))]
  const email=decode?.[Object.keys(decode).find(u=>u.includes("emailaddres"))]
  localStorage.setItem("Role",role)
  localStorage.setItem("Id",nameIdentifiyer)
  localStorage.setItem("Email",email)
  return
};
