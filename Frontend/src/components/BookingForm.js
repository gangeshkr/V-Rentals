import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Paper, Typography, Button, Box, Stepper, Step, StepLabel, Alert } from '@mui/material';
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
    startDate: Yup.date()
      .required('Start date is required')
      .min(new Date(Date.now() - 86400000), 'Start date cannot be in the past'), 
    endDate: Yup.date()
      .required('End date is required')
  }),
};

const BookingForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          const response = await axios.post('http://localhost:3001/api/booking/createBooking', {
            vehicleId: values.vehicleModel,
            startDate: values.startDate.toISOString().split('T')[0],
            endDate: values.endDate.toISOString().split('T')[0],
            customerName: `${values.firstName} ${values.lastName}`,
            customerEmail: `${values.firstName.toLowerCase()}.${values.lastName.toLowerCase()}@example.com`,
          });

          if (response.data.success) {
            setSuccess('Booking successful!');
            formik.resetForm();
            setActiveStep(0);
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'An error occurred while creating the booking';
          setError(errorMessage);
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
        setError('Error fetching vehicles');
      }
    };
    fetchVehicles();
  }, []);

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
        setError('Error fetching available vehicles');
      }
    }
  };

  const handleDateChange = () => {
    // formik.setFieldValue('vehicleModel', '');
    fetchAvailableVehicles();
  };

  const hasDateRange = Boolean(formik.values.startDate && formik.values.endDate);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <NameStep formik={formik} />;
      case 1:
        return <WheelTypeStep formik={formik} />;
      case 2:
        return <VehicleTypeStep formik={formik} vehicleTypes={vehicles} selectedWheels={formik.values.wheels} />;
      case 3:
        return (
          <VehicleModelStep 
            formik={formik} 
            allVehicles={vehicles} 
            availableVehicles={availableVehicles}
            selectedType={formik.values.vehicleType}
            hasDateRange={hasDateRange}
          />
        );
      case 4:
        return <DateRangeStep formik={formik} onDateChange={handleDateChange} />;
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ minHeight: '200px' }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
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
              {activeStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BookingForm;