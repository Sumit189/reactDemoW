import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';  
import {ToggleButton} from 'react-bootstrap';  
import { useEffect, useState } from 'react';  
import Button from "react-bootstrap/Button";
import TimePicker from 'react-time-picker';

function App() {
  const [timeInput, changeTime] = useState(null);  
  const questionStyle = {
    fontSize: 22,
    textAlign: "center",
    paddingTop: "100px",
  }
  const myheaders ={
    'Content-type': 'application/json',
   }

  const [state, setChecked] = useState({checked: false, selected: null}) 
  const [question, setQuestion] = useState({ques: null})
 
  const [options, setOptions] = useState([])
  const [currentQ, setQ] = useState(1)
  const [inputType, setInput] = useState("options")

  var fetchedOptions = []

  function optionGetter(){
    fetch("https://demo-app-wysa.herokuapp.com/options?ques_id="+currentQ,{
          headers: myheaders,
          method: "GET",
        }).then((response) =>{
          response.json().then((data)=>{
            const responseData = JSON.parse(data.options)
            for (const [option_id, content] of Object.entries(responseData)) {
              fetchedOptions.push(
                  <div>
                    <ToggleButton  
                    key={option_id}
                    style={{borderRadius: '18px', width: '520px', height: '50px', color: '#fff', lineHeight: '30px'}}   
                    className="mb-3"  
                    id={`toggle-check${option_id}`}
                    type="checkbox"  
                    variant="outline-primary"  
                    value= {option_id}
                    onChange={(e) => setChecked({checked: e.currentTarget.checked, selected: e.currentTarget.value})}  
                    > 
                    {content}
                    </ToggleButton>
                    <br/>
                  </div>  
              )
            }
            setOptions(fetchedOptions)
          })
        })
  }

  function timeGetter(){
    fetchedOptions = []
    fetchedOptions.push(
      <div>  
       <TimePicker className="bg-white" onChange={changeTime} value={timeInput} />
      </div>  
    )
    setOptions(fetchedOptions)
  }

  useEffect(() => {
    fetch("https://demo-app-wysa.herokuapp.com/question?ques_id="+currentQ,{
      headers: myheaders,
      method: "GET",
    }).then((qResponse) =>{
      if(qResponse.status === 200){
        qResponse.json().then((qData)=>{
          setQuestion({ques: qData.question})
          if(qData.input_type === "options"){
            setInput("options")
            optionGetter()
          }
          else if(qData.input_type === "time"){
            setInput("time")
            timeGetter()
          }
        })
      }
      else{
          document.getElementById("dataForm").innerHTML = `
          <p key="ques" style={questionStyle}> Data Saved </p>
          `
      } 
      })
    }, [currentQ])

  function submitForm(){   
    if(state.selected != null || timeInput != null){
      let ans;
      const selectedOption = state.selected
      if(inputType === "options"){
         ans = selectedOption
      }
      else{
         ans = timeInput
      }
      const ques = currentQ
      const data = {
        question: ques,
        answer: ans,
        input_type: inputType
      }
      console.log(JSON.stringify(data));
      fetch("https://demo-app-wysa.herokuapp.com/onboarding",{
        headers: myheaders,
        method: "POST",
        body: JSON.stringify(data),
      }).then((response) =>{
        if(response.status === 200){
          if(currentQ > 2){
            document.getElementById("dataForm").innerHTML = `
            <p key="ques" style={questionStyle}> Data Saved </p>
            `
          }
          else{
            setQ(currentQ+1)
          }
        }
      })
    }
  };

  return (
    <div className="App">
      <div id='dataForm'>
        <p key="ques" style={questionStyle}> {question.ques} </p>
        <form id='onboardForm'>
          {options}
          <Button className="mt-3" style={{borderRadius: '50%', textAlign: 'center', fontSize: '20px', backgroundColor: 'yellow', color: '#000', border: '0px', height: '50px', width: '50px'}} type="button" onClick={() => submitForm()}>
          <i className="fa-solid fa-arrow-down"></i>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default App;
