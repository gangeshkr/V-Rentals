import { TextField, Box, Typography } from '@mui/material';
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
  // Get unique vehicle types based on category
  const uniqueTypes = [...new Set(vehicleTypes
    .filter(vehicle => 
      selectedWheels === "2" ? 
        vehicle.VehicleType?.category === "bike" : 
        vehicle.VehicleType?.category === "car"
    )
    .map(vehicle => vehicle.VehicleType?.name)
  )];

  return (
    <FormControl
      component="fieldset"
      error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
      fullWidth
    >
      <FormLabel component="legend">
        {selectedWheels === "2" ? "Bike Type" : "Car Type"}
      </FormLabel>
      <RadioGroup
        name="vehicleType"
        value={formik.values.vehicleType}
        onChange={(e) => {
          formik.setFieldValue('vehicleType', e.target.value);
          formik.setFieldValue('vehicleModel', ''); // Reset vehicle model when type changes
        }}
        onBlur={formik.handleBlur}
      >
        {uniqueTypes.map((typeName) => (
          <FormControlLabel
            key={typeName}
            value={typeName}
            control={<Radio />}
            label={typeName}
          />
        ))}
      </RadioGroup>
      {formik.touched.vehicleType && formik.errors.vehicleType && (
        <FormHelperText>{formik.errors.vehicleType}</FormHelperText>
      )}
    </FormControl>
  );
};

const VehicleModelStep = ({ formik, allVehicles, availableVehicles, selectedType, hasDateRange }) => {
  // Filter vehicles by type from all vehicles
  const vehiclesOfType = allVehicles.filter(
    vehicle => vehicle.VehicleType?.name === selectedType
  );

  // If dates are selected, further filter by availability
  const finalVehicleList = hasDateRange ? 
    vehiclesOfType.filter(vehicle => 
      availableVehicles.some(av => av.id === vehicle.id)
    ) : 
    vehiclesOfType;

  return (
    <Box>
      <FormControl
        component="fieldset"
        error={formik.touched.vehicleModel && Boolean(formik.errors.vehicleModel)}
        fullWidth
      >
        <FormLabel component="legend">Select Vehicle Model</FormLabel>
        {finalVehicleList.length === 0 ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {hasDateRange ? 
              "No vehicles available for the selected type and dates." :
              "No vehicles available for the selected type."}
          </Typography>
        ) : (
          <>
            <RadioGroup
              name="vehicleModel"
              value={formik.values.vehicleModel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {finalVehicleList.map((vehicle) => (
                <FormControlLabel
                  key={vehicle.id}
                  value={vehicle.id.toString()}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1">
                        {`${vehicle.name} - ${vehicle.model} (${vehicle.year})`}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Registration: {vehicle.registrationNumber}
                      </Typography>
                      {hasDateRange && <Typography variant="caption" color="success.main" display="block">
                        Available for selected dates
                      </Typography>}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
            {hasDateRange && (
              <Typography variant="caption" color="info.main" sx={{ mt: 1, display: 'block' }}>
                * Only showing vehicles available for your selected dates
              </Typography>
            )}
          </>
        )}
        {formik.touched.vehicleModel && formik.errors.vehicleModel && (
          <FormHelperText>{formik.errors.vehicleModel}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

// DateRangeStep remains mostly the same but with additional callback
const DateRangeStep = ({ formik, onDateChange }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
      <DatePicker
        label="Start Date"
        value={formik.values.startDate}
        onChange={(date) => {
          formik.setFieldValue('startDate', date);
          if (onDateChange) onDateChange();
        }}
        minDate={new Date()}
      />
      <DatePicker
        label="End Date"
        value={formik.values.endDate}
        onChange={(date) => {
          formik.setFieldValue('endDate', date);
          if (onDateChange) onDateChange();
        }}
        minDate={formik.values.startDate || new Date()}
      />
      {formik.touched.startDate && formik.errors.startDate && (
        <FormHelperText error>{formik.errors.startDate}</FormHelperText>
      )}
      {formik.touched.endDate && formik.errors.endDate && (
        <FormHelperText error>{formik.errors.endDate}</FormHelperText>
      )}
    </Box>
  </LocalizationProvider>
);

export { NameStep, WheelTypeStep, VehicleTypeStep, VehicleModelStep, DateRangeStep };