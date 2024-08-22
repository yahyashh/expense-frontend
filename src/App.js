import React, { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"
import { Container, Box, Button, Center, Input, RadioGroup, Stack, Radio, useToast } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react'

const App = () => {
  const [name, setName] = useState("")
  const [radio, setRadio] = useState("")
  const [money, setMoney] = useState(0)
  const [expenseResult, setExpenseResult] = useState([])
  const [incomeResult, setIncomeResult] = useState([])
  const [result, setResult] = useState([])
  const [incomeAmount, setIncomeAmount] = useState(0)
  const [expenseAmount, setExpenseAmount] = useState(0)
  const [resultAmount, setResultAmount] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()
  
  let isum = 0
  let esum = 0
  
  const getData=async ()=>{
    try {
        const {data} = await axios.get("http://localhost:5000/api/allexpense")
        setResult(data)
        console.log(data);
      } catch (error) {
        console.error(error);
      }
  }

  const handleDelete = async (id)=>{
    try {
      await axios.delete(`http://localhost:5000/api/${id}`)
      getData()
    } catch (error) {
      console.log(error);
      toast({
        title: error.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
    }
  }

  const handleClick = async ()=>{
    if(radio === "expense"){
      if(!money || !name){
        toast({
          title: 'You must fill.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top-left",
        })
        return;
      }
      try {
        await axios.post("http://localhost:5000/api/expense",{
          name: name,
          expense: money
        })
        getData()
      } catch (error) {
        toast({
          title: error.message,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top-left",
        })
      }
    }

    // Income
    if(radio === "income"){
      if(!money || !name){
        toast({
          title: 'You must fill.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top-left",
        })
        return;
      }
      try {
        await axios.post("http://localhost:5000/api/income",{
          name: name,
          expense: money
        })
        getData()
      } catch (error) {
        toast({
          title: error.message,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top-left",
        })
      }
    }

    
  }
  
  useEffect(()=>{
    getData()
  },[])
    
useEffect(()=>{
  const incomeR = result.filter(function (i) {
    return i.income === true
  })

  const expenseR = result.filter(function (i) {
    return i.income === false
  })

  console.log(incomeR);  
  console.log(expenseR);
  setIncomeResult(incomeR);
  setExpenseResult(expenseR);
  
},[result])

useEffect(()=>{
  const amounts = ()=>{
   try {
    incomeResult.map((i)=>{
      return isum += i.expense
    })
  
    expenseResult.map((i)=>{
      return esum += i.expense
    })
    localStorage.setItem('Isum', JSON.stringify(isum))
    localStorage.setItem('Esum', JSON.stringify(esum))
    const ls = localStorage.getItem("Isum")
    console.log(localStorage.getItem("Esum"));
    setIncomeAmount(ls)
    setExpenseAmount(esum)
    
   } catch (error) {
    toast({
      title: error.message,
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "top-left",
    })
   }
  }
  amounts()
}, [incomeResult, expenseResult])

useEffect(()=>{
  localStorage.setItem('amount', JSON.stringify(incomeAmount - expenseAmount))
      setResultAmount(localStorage.getItem("amount"))
      console.log(localStorage.getItem("amount"))
},[incomeAmount, expenseAmount])

 return(
  <Container bg="red.200" w={[300, 400, 550]} px="12">
    <Heading display="flex" justifyContent="center" py="4">Expense Tracker</Heading>

    <Box  display="flex" justifyContent="space-between" alignItems="center">
      <Text fontWeight="bold" fontSize='md'>Total Balance: {resultAmount}Rs</Text>
      <Button onClick={onOpen} bgColor="black" textColor="white" size="sm">Add</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Make Your Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

          <RadioGroup onChange={setRadio} value={radio}>
            <Stack direction='row'>
            <Radio value="expense">Expense</Radio>
            <Radio value="income">Income</Radio>
            </Stack>
          </RadioGroup>

            <FormControl>
              <FormLabel>Transaction Name</FormLabel>
              <Input value={name} onChange={(e)=> setName(e.target.value)} placeholder='Name' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input type="number" value={money} onChange={(e)=> setMoney(e.target.value)} placeholder='Price' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClick} colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>

    <Box display="flex" justifyContent="space-between" gap="10" py="3">
    <Card bg="white" px="3" h="110">
     <CardBody w="150px" justifyContent="center" display="flex" alignItems="center" flexDir="column">
      <Text textColor="red" fontWeight="bold">Expense</Text>
     <Text textColor="red" fontWeight="bold">{expenseAmount}Rs</Text>
     </CardBody>
    </Card>

    <Card bg="white" px="3" h="110">
     <CardBody w="150px" justifyContent="center" display="flex" alignItems="center" flexDir="column">
     <Text textColor="green.700" fontWeight="bold">Income</Text>
     <Text textColor="green.700" fontWeight="bold">{incomeAmount}Rs</Text>
     </CardBody>
     </Card>
    </Box>

    <Box gap="2" display="flex" flexDirection="column">
     <Text fontSize="lg" fontWeight="bold">Transactions</Text>
 
      {result.map((result)=>(
        <Card className={result.income ? "completed" : "task"} mb="1" key={result._id}>
         <CardBody display="flex" justifyContent="space-between" p="1.5" px="2">
         <Text>{result.name}</Text>
         <Box display="flex" gap="1" >
           <svg onClick={() => handleDelete(result._id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg">
             <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
         </svg>
         <Text fontWeight="bold">{result.expense}Rs.</Text>
         </Box>
           </CardBody>
      
        </Card>
         ))}

    </Box>
  </Container>
 )
}

export default App
