import React,{useRef,useState} from 'react'
import {Link} from 'react-router-dom'
import client from "../sanity";
import Papa from "papaparse";
import Notice from '../components/Notice'; 
 // Allowed extensions for input file
const allowedExtensions = ["csv"];
function Load() {
    const uploadForm = useRef(null) 
    // correct file extension is not used
    const [error, setError] = useState("");
    // It will store the file uploaded by the user
    const [file, setFile] = useState(""); 

    // This function will be called when
    // the file input changes
    const handleFileChange = (e) => {
        // console.log(e.target)
        setError("");
         
        // Check if user has entered the file
        if (e.target.files.length) {
            const inputFile = e.target.files[0];
             
            // Check the file extensions, if it not
            // included in the allowed extensions
            // we show the error
            const fileExtension = inputFile?.type.split("/")[1];
            if (!allowedExtensions.includes(fileExtension)) {
                setError("Please input a csv file");
                return;
            }
 
            // If input type is correct set the state
            setFile(inputFile);
        }
    };
    // the file input changes

    const upload = ()=>{
        const form = uploadForm.current
        let type = form['category'].value
        if (type == 'DEFAULT') {
            setError('Kindly select investor category')
            
        }else{
            handleParse(type)
        }
    }
    const handleParse =  (type) => { 
        // If user clicks the parse button without
        // a file we show a error
        if (!file) return setError("Enter a valid file");
 
        // Initialize a reader which allows user
        // to read any file or blob.
        const reader = new FileReader();
         
        // Event listener on reader when the file
        // loads, we parse it and set the data.
        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, { header: true });
            const parsedData = csv?.data; 
            let cursor = 0 

            const interval = setInterval(() => {
                const doc = {
                    _type: 'investors',
                    address: parsedData[cursor]['Wallet'],
                    category: type,
                    amount:parsedData[cursor]['Token'],
                  }
                  client.create(doc).then((res) => {
                    console.log(`Investor was added ${res._id}`)
                    }) 
                if (cursor == parsedData.length) {
                    clearInterval(interval)
                }
                cursor ++
            }, 1500);
        };
        reader.readAsText(file); 
    };

  return (
    <div className="">
        <div className="text-center">
            <div className="max-w-md">
            {(error) ? <Notice type={'error'} message={error}/> : <p></p>}
            <h1 className="text-5xl font-bold">sadssad </h1>
            <p className="py-6">sdsads </p>
            <form ref={uploadForm}>
                <div className='my-1'>
                    <select name="category" className="select select-ghost w-full max-w-xs" defaultValue={'DEFAULT'} >
                        <option disabled value="DEFAULT">Select Category</option>
                        <option value={'IDO'}>IDO</option>
                        <option value={'SEED'}>SEED</option> 
                    </select>
                </div>
                <div className="m-4">
                    <label className="inline-block mb-2 text-gray-500">File Upload</label>
                    <div className="flex items-center justify-center w-full">
                        <input type="File" className=" " name='file'  onChange={handleFileChange} />
                    </div>
                </div>
            </form>

             

            <Link to='#' className="btn btn-primary" onClick={upload}>Load Files</Link>
            </div>
        </div>
    </div>
  )
}

export default Load