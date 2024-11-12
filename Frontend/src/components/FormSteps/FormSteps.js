
import { TextField, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';

const NameStep = ({ formik }) => (
  <Box>
    <TextField
      fullWidth
      id="firstName"
      name="firstName"
      label="First Name"
      value={formik.values.firstName}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
      helperText={formik.touched.firstName && formik.errors.firstName}
      margin="normal"
    />
    <TextField
      fullWidth
      id="lastName"
      name="lastName"
      label="Last Name"
      value={formik.values.lastName}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
      helperText={formik.touched.lastName && formik.errors.lastName}
      margin="normal"
    />
  </Box>
);

const WheelTypeStep = ({ formik }) => (
  <FormControl 
    component="fieldset" 
    error={formik.touched.wheels && Boolean(formik.errors.wheels)}
    fullWidth
  >
    <FormLabel component="legend">Number of Wheels</FormLabel>
    <RadioGroup
      name="wheels"
      value={formik.values.wheels}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    >
      <FormControlLabel value="2" control={<Radio />} label="2 Wheels" />
      <FormControlLabel value="4" control={<Radio />} label="4 Wheels" />
    </RadioGroup>
    {formik.touched.wheels && formik.errors.wheels && (
      <FormHelperText>{formik.errors.wheels}</FormHelperText>
    )}
  </FormControl>
);

const VehicleTypeStep = ({ formik, vehicleTypes, selectedWheels }) => {
  const filteredTypes = vehicleTypes.filter(type => 
    (selectedWheels === "2" && type.vehicleType.category === "bike") ||
    (selectedWheels === "4" && type.vehicleType.category === "car")
  );

  return (
    <FormControl 
      component="fieldset" 
      error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
      fullWidth
    >
      <FormLabel component="legend">Vehicle Type</FormLabel>
      <RadioGroup
        name="vehicleType"
        value={formik.values.vehicleType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        {filteredTypes.map((type) => (
          <FormControlLabel
            key={type.id}
            value={type.id.toString()}
            control={<Radio />}
            label={type.name}
          />
        ))}
      </RadioGroup>
      {formik.touched.vehicleType && formik.errors.vehicleType && (
        <FormHelperText>{formik.errors.vehicleType}</FormHelperText>
      )}
    </FormControl>
  );
};

const VehicleModelStep = ({ formik, availableVehicles, selectedType }) => {
  const filteredVehicles = availableVehicles.filter(
    vehicle => vehicle.VehicleTypeId.toString() === selectedType
  );

  return (
    <FormControl 
      component="fieldset" 
      error={formik.touched.vehicleModel && Boolean(formik.errors.vehicleModel)}
      fullWidth
    >
      <FormLabel component="legend">Vehicle Model</FormLabel>
      <RadioGroup
        name="vehicleModel"
        value={formik.values.vehicleModel}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        {filteredVehicles.map((vehicle) => (
          <FormControlLabel
            key={vehicle.id}
            value={vehicle.id.toString()}
            control={<Radio />}
            label={`${vehicle.name} - ${vehicle.model} (${vehicle.year})`}
          />
        ))}
      </RadioGroup>
      {formik.touched.vehicleModel && formik.errors.vehicleModel && (
        <FormHelperText>{formik.errors.vehicleModel}</FormHelperText>
      )}
    </FormControl>
  );
};

const DateRangeStep = ({ formik }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <DatePicker
        label="Start Date"
        value={formik.values.startDate}
        onChange={(date) => formik.setFieldValue('startDate', date)}
        renderInput={(params) => (
          <TextField
            {...params}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
            fullWidth
          />
        )}
        minDate={new Date()}
      />
      <DatePicker
        label="End Date"
        value={formik.values.endDate}
        onChange={(date) => formik.setFieldValue('endDate', date)}
        renderInput={(params) => (
          <TextField
            {...params}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
            fullWidth
          />
        )}
        minDate={formik.values.startDate || new Date()}
      />
    </Box>
  </LocalizationProvider>
);

export { NameStep, WheelTypeStep, VehicleTypeStep, VehicleModelStep, DateRangeStep };