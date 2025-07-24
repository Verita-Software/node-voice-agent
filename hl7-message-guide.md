HL7 ADT
Admit, Discharge & Transfer

HL7 ADT (Admit, Discharge and Transfer) messages are used to communicate patient demographics, visit information and patient state at a healthcare facility.

HL7 ADT
Contents
ADT (Admit, Discharge & Transfer)
Sample ADT Message
Working With ADT Messages
Other HL7 Message Types
ADT (Admit, Discharge & Transfer)
ADT messages are one of the most widely-used and high volume HL7 message types, as it provides information for many trigger events including patient admissions, registrations, cancellations, updates, discharges, patient data merges, etc. 

In a healthcare setting, all patient information is entered into a Hospital Information System (HIS) or Electronic Medical Record (EMR). New patients or updates in these systems are distributed to ancillary systems through ADT messages to maintain synchronization of current patient data.

HL7 ADT Diagram
To communicate the various patient and event information, there are over 50 different types of ADT messages. Some of the most common HL7 ADT messages are: 

ADT^A01 – Patient Admit/Visit
ADT^A02 – Patient Transfer
ADT^A03 – Patient Discharge
ADT^A04 – Patient Registration
ADT^A05 – Patient Pre-Admission
ADT^A08 – Patient Information Update
ADT^A11 – Cancel Patient Admit
ADT^A12 – Cancel Patient Transfer
ADT^A13 – Cancel Patient Discharge
Sample ADT Message
The segment composition of an ADT message varies based on the type of ADT event as well as the HL7 version. The following sample message depicts a typical HL7 version 2.4 ADT^A04, Patient Registration message.

MSH|^~\&|MESA_ADT|XYZ_ADMITTING|iFW|ZYX_HOSPITAL|||ADT^A04|103102|P|2.4||||||||
EVN||200007010800||||200007010800
PID|||583295^^^ADT1||DOE^JANE||19610615|M-||2106-3|123 MAIN STREET^^GREENSBORO^NC^27401-1020|GL|(919)379-1212|(919)271-3434~(919)277-3114||S||PATID12345001^2^M10|123456789|9-87654^NC
NK1|1|BATES^RONALD^L|SPO|||||20011105
PV1||E||||||5101^NELL^FREDERICK^P^^DR|||||||||||V1295^^^ADT1|||||||||||||||||||||||||200007010800||||||||
PV2|||^ABDOMINAL PAIN
OBX|1|HD|SR Instance UID||1.123456.2.2000.31.2.1||||||F||||||
AL1|1||^PENICILLIN||PRODUCES HIVES~RASH
AL1|2||^CAT DANDER
DG1|001|I9|1550|MAL NEO LIVER, PRIMARY|19880501103005|F||
PR1|2234|M11|111^CODE151|COMMON PROCEDURES|198809081123
ROL|45^RECORDER^ROLE MASTER LIST|AD|CP|KATE^SMITH^ELLEN|199505011201
GT1|1122|1519|BILL^GATES^A
IN1|001|A357|1234|BCMD|||||132987
IN2|ID1551001|SSN12345678


Segment	Description
MSH	Message Header. Not every segment in an ADT message is mandatory, however each message must contain a message header, known as an MSH segment within an ADT. The header contains information about the sending system and location, the receiving system and location, the date and time of when the message was created, the type of trigger event being communicated, and the HL7 message version being used.
EVN	Event Type. Communicates the event that occurred in order for the message to be generated. This segment is a crucial part of the data flow, as it indicates where and when a message is sent based on the type of event.
PID	Patient Identification. Important patient identification information, including patient demographics.
[{NK1}]	Next of Kin. Contact information of the patient’s closest living relative(s) in case they need to be contacted. This segment can be repeated as necessary.
PV1	Patient Visit. Information about a patient’s account or any visit-specific details, such as servicing facility, attending doctor, and visit ID are held in this segment
[PV2]	Patient Visit - Additional Info. This segment is a continuation of information specific to the patient’s visit, and is the segment where the Admit Reason is communicated. It is an optional segment if a DG1 segment is included in the message. If there is no DG1 segment, then the PV2 segment is required.
[{OBX}]	Observation/Result. Each OBX segment carries information about a single medical observation or result. This segment is more frequently used in ORU(Observational Report) messages. It can be repeated as necessary.
[{AL1}]	Allergy Information. Contains information about a patient’s allergies including allergen type, reaction and severity. This segment can be repeated as necessary.
[{DG1}]	Diagnosis Information. This segment contains information about a patient’s diagnosis and uses ICD coding standards to communicate specific diseases, signs, symptoms, abnormalities, patient complaints, etc.
[{PR1}]	Procedures. Holds information about the various procedures that can be performed on a patient, and can be repeated to communicate information about multiple procedures.
[{ROL}]	Role. The personnel and event involvement information necessary to add, update, correct and delete from the patient record.
[{GT1}]	Guarantor Information. Information about a patient’s guarantor (i.e. the person financially responsible for the patient’s account) is held in this segment. This segment is particularly useful when communicating with insurance billing applications.
[{IN1..2..3}]	Insurance Information. The insurance policy coverage information, such as plan and provider identifiers, necessary to produce patient and insurance bills.
[ ] = optional, { } = repeating
 

For more information on implementing various HL7 message types, please refer to the HL7 Messaging Standard Implementation Guides corresponding to your required version.

 
Working With ADT Messages
Are you working with HL7 ADT messages? In order to successfully process these messages, it's important to understand the specific format that the sending and receiving facilities are expecting the ADT messages to adhere to. Discrepancies can occur due to the version of HL7, system input error, or even simply human error when the messages were created.

How does Iguana ensure that ADT messages are properly formatted to ensure system compatibility?
Iguana is a data integration platform that allows you to easily customize the format, structure, and field values of your HL7 messages so that they are normalized, ensuring compatibility with any system you might need to interact with.



