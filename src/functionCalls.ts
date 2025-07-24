import axios from "axios"

// HL7 utility functions
export const sendSiuAdtOutbound = async (hl7Message: string, type: string) => {
    try {
        const transformedMessage = await transformHL7Message(hl7Message);
        const startChar = "";
        const endChar = "\n";

        let endpoint = "";
        if (type === "SIU") {
            endpoint = process.env.OUTBOUND_SIU_ENDPOINT!;
        } else if (type === "ADT") {
            endpoint = process.env.OUTBOUND_ADT_ENDPOINT!;
        }

        const finalMessage = startChar + transformedMessage + endChar;

        const response = await axios.post(
            endpoint,
            finalMessage, // No MLLP framing
            {
                headers: {
                    "Content-Type": "text/plain", // or even text/hl7
                },
            }
        );
        console.log("Logger -> sendSiuAdtOutbound -> response:", response)

        return response.data;
    } catch (error) {
        console.error("Error sending HL7 message to Mirth:", error);
        throw error; // Re-throw error to handle it at a higher level if needed
    }
};

export const transformHL7Message = async (hl7Message: string) => {
    // Split the HL7 message into lines
    let lines = hl7Message.split("\n");

    // Iterate through the lines to find and modify the SCH segment
    lines = lines.map((line) => {
        if (line.startsWith("MSH|")) {
            let fields = line.split("|");

            // Modify the 11th field to include '^^^' if it contains two subfields separated by '^'
            fields[5] = "303741";

            return fields.join("|");
        }
        if (line.startsWith("SCH|")) {
            // Split the SCH segment into fields using '|'
            let fields = line.split("|");

            // Modify the 11th field to include '^^^' if it contains two subfields separated by '^'
            if (fields[11]) {
                fields[11] = `^^^${fields[11]}`;
            }

            // Rejoin the fields to reconstruct the modified SCH segment
            return fields.join("|");
        }
        return line; // Leave other lines unchanged
    });

    // Rejoin the lines to reconstruct the HL7 message
    return lines.join("\n");
};

// Function to generate HL7 SIU message for appointment booking
const generateHL7SIUMessage = (appointmentData: any) => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const messageControlId = Math.floor(Math.random() * 10000);

    // Format appointment time
    const appointmentDate = new Date(appointmentData.appointmentTime);
    const startTime = appointmentDate.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const endTime = new Date(appointmentDate.getTime() + (appointmentData.duration * 60000))
        .toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

    // Generate patient ID (using first name + random number for demo)
    const patientId = appointmentData.firstName.toLowerCase() + Math.floor(Math.random() * 1000);

    // Format birth date
    const birthDate = appointmentData.birthDate.replace(/-/g, '');

    const hl7Message = `MSH|^~\\&||ECW|ECW||${timestamp}||SIU^S12|${messageControlId}|T|2.4
SCH|${appointmentData.id}|${appointmentData.id}||||||${appointmentData.visitType}|||${startTime}^${endTime}||||||||||||||PEN|||
PID|1|${patientId}||${patientId}|${appointmentData.lastName}^${appointmentData.firstName}^||${birthDate}|${appointmentData.sex}|||^^^^|0||^|||||||||2||||||||||||||||
PV1|1||2^Middletown Medical PC||||${appointmentData.providerId}^${appointmentData.provider.split(' ').slice(1).join('^')}||||||||||||${appointmentData.id}||||||||||||||||||||||||${startTime}|
AIG|||259078^Adult Vaccine Clinic^|||
AIL|1||2^Middletown Medical PC|
AIP|1||${appointmentData.providerId}^${appointmentData.provider.split(' ').slice(1).join('^')}|`;

    return hl7Message;
};

export const FUNCTION_DEFINITIONS = [
    {
        "name": "find_patient",
        "description": `Look up a customer's account information. Use context clues to determine what type of identifier the user is providing:

        Patient ID formats:
        - Numbers only (e.g., '169', '42') → Format as 'CUST0169', 'CUST0042'
        - With prefix (e.g., 'CUST169', 'customer 42') → Format as 'CUST0169', 'CUST0042'
        
        Phone number recognition:
        - Standard format: '555-123-4567' → Format as '+15551234567'
        - With area code: '(555) 123-4567' → Format as '+15551234567'
        - Spoken naturally: 'five five five, one two three, four five six seven' → Format as '+15551234567'
        - International: '+1 555-123-4567' → Use as is
        - Always add +1 country code if not provided
        
        Email address recognition:
        - Spoken naturally: 'my email is john dot smith at example dot com' → Format as 'john.smith@example.com'
        - With domain: 'john@example.com' → Use as is
        - Spelled out: 'j o h n at example dot com' → Format as 'john@example.com'`,
        "parameters": {
            "type": "object",
            "properties": {
                "patient_id": {
                    "type": "string",
                    "description": "Customer's ID. Format as CUSTXXXX where XXXX is the number padded to 4 digits with leading zeros. Example: if user says '42', pass 'CUST0042'",
                },
                "phone": {
                    "type": "string",
                    "description": `Phone number with country code. Format as +1XXXXXXXXXX:
                    - Add +1 if not provided
                    - Remove any spaces, dashes, or parentheses
                    - Convert spoken numbers to digits
                    Example: 'five five five one two three four five six seven' → '+15551234567'`,
                },
                "email": {
                    "type": "string",
                    "description": `Email address in standard format:
                    - Convert 'dot' to '.'
                    - Convert 'at' to '@'
                    - Remove spaces between spelled out letters
                    Example: 'j dot smith at example dot com' → 'j.smith@example.com'`,
                },
            },
        },
    },
    {
        "name": "create_appointment",
        "description": "Schedule a new appointment for a customer. Use this function when:\n- A customer wants to book a new appointment\n- A customer asks to schedule a service\n\nBefore scheduling:\n1. Verify the customer's account exists using find_patient.\n2. Confirm the date, time, and service type with the customer before booking.\n3. Check availability using check_availability.",
        "parameters": {
            "type": "object",
            "properties": {
                "patientName": {
                    "type": "string",
                    "description": "The full name of the patient, including first and last name."
                },
                "firstName": {
                    "type": "string",
                    "description": "The patient's first name."
                },
                "lastName": {
                    "type": "string",
                    "description": "The patient's last name."
                },
                "birthDate": {
                    "type": "string",
                    "description": "The patient's date of birth in ISO format (YYYY-MM-DD)."
                },
                "sex": {
                    "type": "string",
                    "description": "The patient's gender. Must be one of the following: M (Male), F (Female), O (Other).",
                    "enum": ["M", "F", "O"]
                },
                "phoneNumber": {
                    "type": "string",
                    "description": "The patient's contact number, including the country code if applicable."
                },
                "appointmentTime": {
                    "type": "string",
                    "description": "The scheduled appointment date and time in ISO format (YYYY-MM-DD HH:MM:SS). This must be an available and confirmed time slot."
                }
            },
            "required": ["patientName", "firstName", "lastName", "birthDate", "sex", "phoneNumber", "appointmentTime"]
        }
    },
    {
        "name": "check_availability",
        "description": `Check available appointment slots for a date. Use this function when:
        - A customer wants to know available appointment times 
        - Before scheduling a new appointment
        - A customer asks 'When can I come in?' or 'What times are available?'
        - After getting the results from the Api You have to first ask the custumer abount when you want the slats for morning,afternoon or evening. depending upon what you get in the response
        - then Tell him only those particular slots that matches it
        
        After checking availability, present options to the customer in a natural way, like:
        'I have openings on [date] at [time] or [date] at [time]. Which works better for you?'`,
        "parameters": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "description": "The date to check availability for in YYYY-MM-DD format (e.g., '2024-03-15'). The API will return an array of available time slots for this date."
                },
            },
        },
    }
]

const API_BASE_URL = "http://localhost:3005"; // Adjust if needed

// 🔍 Find Patient
export const findPatient = async ({ patient_id, phone, email }: any) => {
    // Return mockup response for testing
    return {
        success: true,
        patient: {
            id: patient_id || "CUST0123",
            name: "Gaurav kumar",
            phone: phone || "+15551234567",
            email: email || "gaurav.kumar@email.com",
            dateOfBirth: "1985-06-15",
            gender: "M",
            lastVisit: "2024-01-15"
        },
        message: "Patient found successfully"
    };

    // Original API call commented out for mockup
    /*
    try {
        const response = await axios.get(`${API_BASE_URL}/find_patient`, {
            params: { patient_id, phone, email },
        });
        return response.data;
    } catch (error) {
        console.error("Error finding patient:", (error as any)?.response?.data || (error as any)?.message);
        return null;
    }
    */
};

// 📅 Create Appointment
// export const createAppointment = async ({ patient_id, date, service }) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/create_appointment`, {
//             patient_id,
//             date,
//             service,
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error creating appointment:", error.response?.data || error.message);
//         return null;
//     }
// };
export const createAppointment = async ({ patientName, firstName, lastName, birthDate, sex, phoneNumber, appointmentTime }: any) => {
    // Return mockup response for testing
    const appointmentData = {
        id: "APT001234",
        patientName: patientName,
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        sex: sex,
        phoneNumber: phoneNumber,
        appointmentTime: appointmentTime,
        provider: "Dr. Sarah Johnson",
        providerId: "9152",
        location: "MiddleTown Medicals - Main Office",
        visitType: "Initial Visit",
        duration: 15,
        status: "confirmed"
    };

    // Generate HL7 SIU message
    const hl7Message = generateHL7SIUMessage(appointmentData);
    console.log("Generated HL7 SIU Message:");
    console.log(hl7Message);

    // For now, just console log the transformed message
    try {
        const transformedMessage = await transformHL7Message(hl7Message);
        console.log("\nTransformed HL7 Message:");
        console.log(transformedMessage);
    } catch (error) {
        console.error("Error transforming HL7 message:", error);
    }

    await sendSiuAdtOutbound(hl7Message, "SIU");

    return {
        success: true,
        appointment: appointmentData,
        message: "Appointment successfully booked"
    };

    // Original API call commented out for mockup
    /*
    try {
        const payload = {
            "bookingFor": patientName,
            "firstName": firstName,
            "lastName": lastName,
            "birthDate": birthDate,
            "resourceType": "Patient",
            "sex": sex,
            "phoneNumber": phoneNumber,
            "infoForProvider": "",
            "appointmentTime": appointmentTime,
            "bookingType": "providers",
            "resourceId": "",
            "providerId": "9152",
            "visitType": "InitialV",
            "duration": 15
        }

        const response = await axios.post(`http://localhost:3032/api/book-appointment`, { ...payload })
        return response.data;
    } catch (error) {
        console.error("Error creating appointment:", (error as any)?.response?.data || (error as any)?.message);
        return null;
    }
    */
};

// 🕒 Check Availability
export const checkAvailability = async ({ date }: any) => {
    // Return mockup response for testing
    return {
        success: true,
        date: date,
        availableSlots: [
            {
                time: "09:00",
                period: "morning",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "09:30",
                period: "morning",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "10:00",
                period: "morning",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "14:00",
                period: "afternoon",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "14:30",
                period: "afternoon",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "15:00",
                period: "afternoon",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "17:00",
                period: "evening",
                provider: "Dr. Sarah Johnson",
                available: true
            },
            {
                time: "17:30",
                period: "evening",
                provider: "Dr. Sarah Johnson",
                available: true
            }
        ],
        message: "Available slots retrieved successfully"
    };

    // Original API call commented out for mockup
    /*
    try {
        const response = await axios.get(`http://localhost:3032/api/available-slots?id=9152&date=${date}&type=providers`);
        return response.data;
    } catch (error) {
        console.error("Error checking availability:", (error as any)?.response?.data || (error as any)?.message || "Network Error");
        return [];
    }
    */
};


export const FUNCTION_MAP = {
    "find_patient": findPatient,
    "create_appointment": createAppointment,
    "check_availability": checkAvailability,
}

