const users = async function(){
    try{
        const res = await fetch("http://my_app.test/api/users");
        const data = await res.json();
        console.log(data);
        

    }
    catch(e){
        console.error(`Error: ${e.message}`);
    }
}