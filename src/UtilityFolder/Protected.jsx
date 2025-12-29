import Unauthorized from "./Unauthorized";

function Protected({ currentRoles, children }) {
    const role = localStorage?.getItem("Role");
    if(role===null)return <Unauthorized/>

    if (currentRoles.some(u => u === role)) {
        return children; 
    } else {
        return <Unauthorized/>; 
    }
}

export default Protected;
