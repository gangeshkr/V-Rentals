import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Paper, Typography, Button, Box, Stepper, Step, StepLabel } from '@mui/material';
import axios from 'axios';
import { NameStep, WheelTypeStep, VehicleTypeStep, VehicleModelStep, DateRangeStep } from '../components/FormSteps/FormSteps';

const steps = ['Personal Details', 'Vehicle Wheels', 'Vehicle Type', 'Vehicle Model', 'Booking Dates'];

const validationSchemas = {
  0: Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
  }),
  1: Yup.object({
    wheels: Yup.string().required('Please select number of wheels'),
  }),
  2: Yup.object({
    vehicleType: Yup.string().required('Please select vehicle type'),
  }),
  3: Yup.object({
    vehicleModel: Yup.string().required('Please select vehicle model'),
  }),
  4: Yup.object({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
  }),
};

const BookingForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      wheels: '',
      vehicleType: '',
      vehicleModel: '',
      startDate: null,
      endDate: null,
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        try {
          await axios.post('http://localhost:3001/api/booking/createBooking', {
            VehicleId: values.vehicleModel,
            startDate: values.startDate,
            endDate: values.endDate,
            customerName: `${values.firstName} ${values.lastName}`,
            customerEmail: `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}@example.com`,
            status: 'confirmed'
          });
          alert('Booking successful!');
          formik.resetForm();
          setActiveStep(0);
        } catch (error) {
          alert(`Booking failed: ${error.response?.data?.message || error.message}`);
        }
      } else {
        setActiveStep(activeStep + 1);
      }
    },
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/vehicle/allVehicles');
        setVehicles(response.data.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      if (formik.values.startDate && formik.values.endDate) {
        try {
          const response = await axios.get('http://localhost:3001/api/vehicle/availableVehicles', {
            params: {
              startDate: formik.values.startDate.toISOString().split('T')[0],
              endDate: formik.values.endDate.toISOString().split('T')[0],
            },
          });
          setAvailableVehicles(response.data.data);
        } catch (error) {
          console.error('Error fetching available vehicles:', error);
        }
      }
    };
    fetchAvailableVehicles();
  }, [formik.values.startDate, formik.values.endDate]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <NameStep formik={formik} />;
      case 1:
        return <WheelTypeStep formik={formik} />;
      case 2:
        return <VehicleTypeStep formik={formik} vehicleTypes={vehicles} selectedWheels={formik.values.wheels} />;
      case 3:
        return <VehicleModelStep formik={formik} availableVehicles={availableVehicles} selectedType={formik.values.vehicleType} />;
      case 4:
        return <DateRangeStep formik={formik} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Vehicle Booking
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ minHeight: '200px' }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(activeStep - 1)}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BookingForm;
