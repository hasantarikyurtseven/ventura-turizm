# UpdatePassenger

## Introduction

The Update Passenger method is an API method used to enter or update passenger information for the flight(s) selected in the Allocate method.

## Limits and Features

### Parameters

- SessionId: The session ID for the current request.
- SessionToken: The session token required for authorization.
- ProductId: The ID of the product to be allocated. This should be set based on the Search method's results.

## Basic Request Structure

Below is an example of a basic `UpdatePassenger` request using SOAP:

```xml
<soap:Body>
		<tem:UpdatePassengers>
			<tem:request>
				<trev:AuthenticationHeader>
					<trev:SessionId>4947934</trev:SessionId>
					<trev:SessionToken>v</trev:SessionToken>
				</trev:AuthenticationHeader>
				<trev1:Form>
					<trev1:ModifiedPassengers i:nil="true"/>
					<trev1:NewPassengers>
						<trev2:T_Passenger>
							<trev2:BirthDate>2024-01-01</trev2:BirthDate>
							<trev2:CitizenNo>00000000000</trev2:CitizenNo>
							<trev2:Email>[email protected]</trev2:Email>
							<trev2:FirstName>PETOUR</trev2:FirstName>
							<trev2:Gender>M</trev2:Gender>
							<trev2:Id>c6150e81-8079-44a8-827d-13b32ecg38a8</trev2:Id>
							<trev2:IfContact>true</trev2:IfContact>
							<trev2:LastName>PETOUR</trev2:LastName>
							<trev2:Nationality>TR</trev2:Nationality>
							<trev2:PassportCountry>TR</trev2:PassportCountry>
							<trev2:PassportNo>P1234567</trev2:PassportNo>
							<trev2:Phone>+90-1234567890</trev2:Phone>
							<trev2:SequenceNo>0</trev2:SequenceNo>
							<trev2:TempTag>37d03cf5-3199-4699-b537-b4ee1557e307</trev2:TempTag>
							<trev2:Type>ADT</trev2:Type>
							<trev2:WheelChairServiceType>0</trev2:WheelChairServiceType>
						</trev2:T_Passenger>
					</trev1:NewPassengers>
					<trev1:ProductIds>
						<arr:guid>113b32ec-38a8-4ec0-9aaa-dc0b74d510b9</arr:guid>
					</trev1:ProductIds>
				</trev1:Form>
			</tem:request>
		</tem:UpdatePassengers>
	</soap:Body>
```

# UpdatePassenger Request

## AuthenticationHeader

- SessionId: A unique identifier used to define a specific session in which a user is granted access to an API for a certain period. You should get this parameter from the response of the Login Method. (M)
- SessionToken: Unique authentication used to represent a specific session in which a user has access to an API. You should get this parameter from the response of the Login Method. (M)

## Form

### Form/NewPassengers

- BirthDate: It refers to the passenger's date of birth. The 'BirthDate' parameter should be in the correct format, which is YYYY-MM-DD. (M)
- CitizenNo: For domestic flights within Turkey, Turkish citizens are required to provide their National ID number, while non-Turkish citizens must enter 11 zeros (00000000000). (M)
- Email: The 'Email' parameter represents the passenger's email address. (M)
- FirstName: The 'FirstName' parameter refers to the passenger's First Name and the Middle Name also(if any). If there are more than one name, then all the names need to be written without any blank between them.
  - Wrong spelling: `<FirstName>JOHN SPENCER</FirstName>`
  - Correct spelling: `<FirstName>JOHNSPENCER</FirstName>`
  (M)
- Gender: The 'Gender' parameter refers to the passenger's gender. This parameter is typically indicated as 'M' (Male) or 'F' (Female). (M)
- Id: The 'ID' parameter refers to the passenger's unique identification number in the system. (M)
- IfContact: It is a field that indicates whether the passenger is the contact person. (M)
  - IfContact = true: This passenger is designated as the contact for the flight.
  - IfContact = false: This passenger is not designated as the contact person.
- LastName: The 'LastName' parameter refers to the passenger's last name. (M)
- Nationality: The 'Nationality' parameter refers to the passenger's nationality or citizenship information. This parameter is typically entered using the two-letter ISO country code (e.g., 'TR' for Turkey, 'US' for the United States). (M)
- PassportCountry: The 'PassportCountry' parameter refers to the country that issued the passenger's passport. This parameter is typically specified in country code format (e.g., 'TR' for Turkey, 'US' for the United States using ISO 3166-1 alpha-2 country codes) and is used to validate passport information. (M)
- PassportNo: It refers to the passenger's passport number. This parameter is used to verify the passenger's identity for international flights. (M)
- PassportValidDate: The 'PassportValidDate' parameter indicates the expiration date of the passenger's passport. This date is typically provided in the YYYY-MM-DD format and shows until which date the passport is valid. (M)
- Phone: The 'Phone' parameter refers to the passenger's phone number. (M)
- SequenceNo: The 'SequenceNo' parameter is a unique sequence number that identifies passengers within a reservation. This parameter is used to differentiate each passenger, especially in a PNR (Passenger Name Record) or booking that includes multiple passengers. (M)
- TempTag: It is used as a temporary ID assigned by the system during the passenger's reservation (PNR) process.
- Type: The 'Type' parameter specifies the passenger's ticketing or reservation type. This parameter is typically used to define the passenger's age group or fare class. Standard 'Type' values used in the aviation industry include:
  - 'ADT' (Adult): Adult passenger (typically 12 years and older)
  - 'CHD' (Child): Child passenger (between 2-11 years old)
  - 'INF' (Infant): Infant passenger (0-2 years old, traveling on lap)
  (M)
- WheelChairServiceType: It is a parameter that indicates whether the passenger requires wheelchair service. (M)
  - 0 → No wheelchair service requested (default).
  - 1 → Wheelchair service requested at the airport.

### Form/ProductIds

- Guid: The same information must be entered as the product ID. (M)

# UpdatePassenger Response

## Result

- HasError: It is a status used to indicate whether an error occurred during the process.
  - true: Indicates that an error occurred during the process. In this case, the payment transaction may have failed, and further error details should be reviewed.
  - false: Indicates that the process was completed without errors and is generally considered successful.
- ServiceError: ServiceError represents a technical or business-related error that occurs during the payment process. This error is usually returned in the form of a code or message, helping the developer understand the issue.
- SystemLogs: It typically contains information or error messages related to system events that occur during the transaction. This field provides details about the situations encountered by the API server during the payment process.

## ShoppingFile

- Index 1 Id: It is the unique identifier for the ShoppingFile. This ID is used to track transactions performed during the session.
- Index 2 IfFinalized: It is a value that indicates whether the reservation has been finalized or is in a state where no further changes can be made. This parameter specifies whether passenger information can still be updated or if the transaction is locked in its final stage.
- Index 3 IsFlightInfoChanged: It indicates whether the flight details have changed (e.g., flight times, airline, departure/arrival airports).
  - true: There are changes in the flight details.
  - false: The flight details remain the same.
- Index 4 IsPriceChanged: It indicates whether the price has changed between the initial shopping process and finalization.
  - true: The price has changed.
  - false: The price remains the same.
- Index 5 IsReservationCancelled: It indicates whether the reservation has been canceled.
  - true: The reservation has been canceled.
  - false: The reservation is active.
- Index 7 Is_CC_Payment_Enabled: It indicates whether the credit card payment option is available.
  - true: Payment can be made using a credit card.
  - false: Payment via credit card is not available.
- Index 8 Is_RA_Payment_Enabled: It indicates whether payment can be made using the Running Account (RA), a method used for corporate or airline-agreement payments.
  - true: Payment can be made using RA.
  - false: Payment via RA is not available.
- Index 9 MaxSc: It indicates the maximum 'Service Class' value for a specific reservation or ticket. This parameter specifies up to which service level the ticket or reservation can be updated or modified.
- Index 10 MinSc: It indicates the minimum 'Service Class' value for a specific reservation or ticket. This parameter specifies the lowest service level to which the ticket or reservation can be updated or modified.
- Index 11 RemainingSum: It represents the remaining amount to be paid during the purchase or update of the ticket. This amount shows the balance the passenger needs to pay to complete the transaction and is typically updated after changes or additional services are applied.

## ShoppingFile/AirBookings

### ShoppingFile/AirBookings/AirBooking

- Index 1 BaseFare: The fare represents the cost of the ticket. This cost refers exclusively to the flight itself and does not include any additional expenses such as taxes, fees, or extra services.
- Index 2 BookingCode: This field is used to retrieve or query the unique identifier of a flight reservation. Typically, this is an alphanumeric code generated at the time of booking, which is used to track your ticket, flight details, and reservation status.
- Index 3 Currency: This field is used to query or set the currency used for ticket prices, fees, and other financial transactions. It is typically employed in operations such as purchasing flight tickets, pricing additional services, or making payments for services, to determine the relevant currency.
- Index 4 ExchangeCurrencyCode: It is necessary to convert ticket prices, fees, or other services into the currency of the user's location or the local market where the transaction takes place. This field is typically used to determine or query the code of the target currency during currency conversions. This method is especially important for international flights or for airlines that accept different currencies.
- Index 5 IsRefundable: Whether a ticket is refundable. This field provides information on whether the ticket purchased by the passenger can be refunded under certain conditions.
- Index 6 LastSellerCommission: The commission amount/service fee determined by the seller (client).
- Index 7 NetFare: It refers to the base fare to be charged to a passenger for a flight.
- Index 8 ProductId: It refers to a unique product identifier (ID) defined for a specific flight or service. This ID enables the identification and processing of the flight or additional service by the system.
- Index 9 SystemServiceFee: This element represents the system service fee associated with a transaction or service.
- Index 11 ServiceFee: This element represents the service fee associated with a transaction or service. For example, if the service fee amount is 3, it is indicated as 3 in this field.
  - ServiceFee = SystemServiceFee + LastSellerCommission
- Index 12 Status: It represents the current status of the reservation process. This field indicates whether the reservation has been successfully completed.
- Index 13 Taxes: This XML element is used to denote the total amount of taxes applicable to a transaction or service within the Trevoo.WS.Entities.Shopping schema.
- Index 14 TotalFare: The TotalFare element represents the complete amount to be paid for a transaction or service.
  - TotalFare = BaseFare + Taxes + ServiceFee
- Index 15 Type: The Type field typically indicates the type of reservation made.
  - Flight → Flight ticket reservation.
- Index 16 CanBeReserved: It indicates whether a specific flight is eligible for reservation.
  - CanBeReserved = True: The selected flight is available for booking under the given conditions. A seat can be allocated for the passenger, and a reservation record can be created.
  - CanBeReserved = False: The flight is not available for reservation. This may be due to one of the following reasons:
    - Reservation is not allowed based on the selected fare rules.
    - The airline has imposed restrictions on booking.
    - There are limitations specific to a particular sales channel.
    - Capacity or sales limits have been reached.

### ShoppingFile/AirBookings/AirBooking/TimeTable

- Index 1 CreationDate: It shows the date and time when the ticket was initially created.
- Index 2 Prebooking_ExpiresAt: This field represents the expiration date and time of a prebooking. In other words, it indicates the deadline by which the customer must complete the reservation before making the payment.
- Index 3 ReservationDate: It indicates the date when the reservation was made.
- Index 4 Reservation_ExpiresAt: This field specifies the date and time when a reservation's validity expires. It represents the time period during which the reservation remains valid before payment is made.

### ShoppingFile/AirBookings/BookingItems

#### ShoppingFile/AirBookings/BookingItems/AirBookingItem

- Index 1 BaseFare: The fare represents the cost of the ticket. This cost refers exclusively to the flight itself and does not include any additional expenses such as taxes, fees, or extra services.
- Index 2 ProductItemId: This element contains a unique identifier (UUID) corresponding to a specific product item within the Trevoo.WS.Entities.Shopping schema. For example, the value `289af8a3-554b-469c-b28a-7ace0feb5487` uniquely identifies the product item associated with this XML entity.
- Index 3 LastSellerCommission: The commission amount/service fee determined by the seller (client).
- Index 4 SystemServiceFee: This element represents the system service fee associated with a transaction or service.
- Index 5 ServiceFee: This element represents the service fee associated with a transaction or service. For example, if the service fee amount is 3, it is indicated as 3 in this field.
  - ServiceFee = SystemServiceFee + LastSellerCommission
- Index 6 Baggage: It refers to the passenger's allocated baggage allowance for the flight. This field includes details and limitations regarding the baggage the passenger is permitted to carry.
- Index 7 VQ: It is a field that indicates additional fees or service charges related to the journey or ticket.
- Index 8 YR: It generally refers to a type of additional fee or surcharge applied during the ticketing process.

#### ShoppingFile/AirBookings/BookingItems/AirBookingItem/PaxReference

- Index 1 Age: It typically represents the passenger's age.
- Index 2 LocalPaxType: It represents the passenger's local type and classifies passengers based on their age or special conditions. This parameter is used in aviation systems to ensure that passengers receive appropriate services and that fare classifications are correctly applied. Typically, the 'LocalPaxType' parameter includes the following categories: ADT (Adult): Adult passenger (generally 12 years and older). CNN (Child): Child passenger (between 2-12 years old). INF (Infant): Infant passenger (0-2 years old, usually traveling on lap). SRC (Senior Citizen): Senior passenger (passengers above a certain age, depending on the airline). STU (Student): Student passenger (may qualify for special student discounts). MIL (Military): Military personnel passenger. CHD: Unaccompanied child passenger.
- Index 3 LocalSequenceNo: It refers to the local sequence number of the passenger in a reservation or ticketing process. This parameter is used to identify multiple passengers within the same reservation record (PNR - Passenger Name Record) in a specific order.
- Index 4 PassengerId: It is a value that represents the passenger's unique identification number.
- Index 5 PaxReferenceId: It is a unique reference number assigned to the passenger.

### ShoppingFile/AirBookings/BrandedFares

#### ShoppingFile/AirBookings/BrandedFares/BrandedFareItems

- Index 1 BrandedFareItemId: It uniquely identifies a specific "branded fare" option, providing a unique ID corresponding to each package.

#### ShoppingFile/AirBookings/BrandedFares/BrandedFareItem/BrandedFarePassengers

- Index 1 PassengerCount: It indicates the number of passengers included in the pricing for each Branded Fare.
- Index 2 PassengerType: It is a field that specifies the passenger's category or type.
  - ADT (Adult): Adult passenger (typically 12 years and older).
  - CHD (Child): Child passenger (typically between 2-11 years old).
  - INF (Infant): Infant passenger (typically under 2 years old, traveling on a lap).

##### ShoppingFile/AirBookings/BrandedFares/BrandedFareItem/BrandedFarePassengers/FareComponents

- Index 1 BrandId: Identifier that represents the brand identity of a specific airline or scheduled flight. This identifier helps distinguish between different fare levels or service packages offered to passengers. For example, some airlines offer different classes and service packages such as economy, premium economy, and business class under different brand identities. BrandId is used to distinguish these different service packages and provide information about a specific class or service package.
- Index 2 BookingClass: "BookingClass" refers to the reservation class of a specific branded fare item. This field determines the class in which the passenger will travel and the services, flexibilities, and advantages offered by that class. It is usually represented by a single letter or a combination of letters.
- Index 3 CabinClass: It specifies the cabin class in which the passenger will be seated during the flight. This field defines different cabin classes that passengers can choose from based on their flight experiences and level of service preferences.
- Index 4 FareBasisCode: "FareBasisCode" refers to the basic fare code that determines the pricing rules and conditions of the ticket. This code defines the fare class applicable to a flight and the flexibility, change, and cancellation conditions of the ticket. It is usually presented as a combination of letters and numbers (e.g., Y26, QFL, or E14NR). The FareBasisCode field indicates the pricing rules and conditions under which the ticket is sold.
- Index 5 FreeBaggageAllowanceId: FreeBaggageAllowanceId is an identifier that defines the free baggage allowance offered for a specific flight or fare class. This identifier indicates how much free baggage allowance passengers have when traveling in a specific fare class.
- Index 6 SeatsAvailable: It refers to the number of seats available for booking on a flight. This indicates the occupancy rate and remaining capacity of the flight.
- Index 7 SegmentId: SegmentId is an identifier that represents the identity of a specific flight or flight segment. Particularly in cases of multi-stop or connecting flights, there are different SegmentIds for each flight section. This allows passengers and systems to understand which part of a particular flight is being referred to.

#### ShoppingFile/AirBookings/BrandedFares/BrandedFareItem/BrandedFarePassengers/PassengerFareInfo

- Index 1 BaseFare: The fare represents the cost of the ticket. This cost refers exclusively to the flight itself and does not include any additional expenses such as taxes, fees, or extra services.
- Index 2 Currency: It indicates the currency in which the specified amount (Amount) for a particular flight or reservation is expressed. This specifies in which currency the ticket prices, taxes, and other fees are calculated and will be paid.
- Index 3 PaxSequence: It is a field that specifies the sequence of passengers' reservations. It refers to the numbering of passengers in a specific order during the reservation process.
- Index 4 PaxType: It refers to the classification of passengers based on their age and status. It is important for ticket pricing, baggage allowance, service level, and other passenger services. The PaxType field helps airlines and travel agencies accurately classify passenger information and develop appropriate service and pricing strategies for each passenger type.
- Index 5 Taxes: This XML element is used to denote the total amount of taxes applicable to a transaction or service within the Trevoo.WS.Entities.Shopping schema.
- Index 6 TotalFare: The TotalFare element represents the complete amount to be paid for a transaction or service.
  - TotalFare = BaseFare + Taxes + ServiceFee

##### ShoppingFile/AirBookings/BrandedFares/BrandedFareItem/BrandedFarePassenger/Policy

###### CancellationPolicies

- Index 1 Amount: This field specifies the monetary value associated with the change policy of a flight. It indicates the cost that applies when a policy is changed. This ensures accurate and transparent management of fees related to policy Cancellation for flights.
- Index 2 Applicability: It is a field that specifies under which conditions a ticket can be canceled and in which situations the cancellation is valid.
  - BeforeDeparture → The cancellation policy applies before the flight departs.
  - AfterDeparture → The cancellation policy applies after the flight has departed.
- Index 3 MinutesToDeparture: It indicates the amount of time remaining (in minutes) until a flight's departure and determines the impact of this duration on the cancellation of the ticket. It specifies the remaining time for a ticket to be canceled and describes the effect of this time on cancellation policies. This information helps passengers understand how much time they have in case of a flight cancellation and how the cancellation can be executed.
- Index 4 Currency: It indicates the currency in which the specified monetary values are denominated. This field specifies the currency used for calculating and displaying ticket prices, taxes, service fees, and other costs, such as TRY (Turkish Lira), USD (US Dollar), EUR (Euro), and GBP (British Pound).
- Index 5 IsRefundable: Whether a ticket is refundable. This field provides information on whether the ticket purchased by the passenger can be refunded under certain conditions.

###### ChangePolicies

- Index 1 Amount: This field specifies the monetary value associated with the change policy of a flight. It indicates the cost that applies when a policy is changed. This ensures accurate and transparent management of fees related to policy changes for flights.
- Index 2 Applicability: It refers to a field that specifies under what conditions and in what manner ticket changes can be implemented.
  - BeforeDeparture: Refers to the change policies that can be applied before the flight departs.
  - AfterDeparture: Specifies changes or penalties applicable after the flight has departed.
- Index 3 MinutesToDeparture: It expresses how much time (in minutes) is left until a flight's departure and specifies the impact of this time on ticket changes. It determines the permissible time frame for ticket changes and shows how long before the flight passengers can make changes to their tickets.
- Index 4 Currency: It indicates the currency in which the specified monetary values are denominated. This field specifies the currency used for calculating and displaying ticket prices, taxes, service fees, and other costs, such as TRY (Turkish Lira), USD (US Dollar), EUR (Euro), and GBP (British Pound).
- Index 5 IsChangeable: This field provides information on whether the ticket purchased by the passenger can be exchanged under certain conditions.

##### ShoppingFile/AirBookings/BrandedFares/BrandedFareItem/TotalFareInfo

- Index 1 TotalFare: The TotalFare element represents the complete amount to be paid for a transaction or service.
  - TotalFare = BaseFare + Taxes + ServiceFee
- Index 2 TotalTaxes: It includes the total amount of all taxes added to the passenger's ticket price.

##### ShoppingFile/AirBookings/BrandedFares/BrandedItem

- Index 1 BrandCode: Is a code that represents the brand identity of a specific airline or flight. This code is used to distinguish between different fare levels or service packages. BrandCode helps passengers determine which services or benefits they will receive when making a reservation. Airlines typically offer various service packages under different brand identities, and these packages may include different features, benefits, or limitations.
- Index 2 BrandId: Identifier that represents the brand identity of a specific airline or scheduled flight. This identifier helps distinguish between different fare levels or service packages offered to passengers. BrandId is used to distinguish these different service packages and provide information about a specific class or service package.
- Index 3 BrandName: BrandName refers to the name of a specific fare class or service package. BrandName is used to describe the different service levels or benefit packages offered by airline companies.

###### ShoppingFile/AirBookings/BrandedFares/BrandedItem/BrandedRule

- Index 1 Application: That specifies the conditions and manner under which a particular fare class or service package is applied. This field explains the circumstances in which a specific fare or service package is valid and the restrictions that apply to it.
  - N : Not Applicable
  - F : Free
  - C : Chargeable
- Index 2 DisplayType: DisplayType is a field that specifies how a particular fare or service package will be displayed to the user. DisplayType controls how this information is presented in the user interface.
- Index 3 RuleDescription: RuleDescription contains the description of the rules and conditions associated with a specific fare class or service package. This description aims to provide passengers with detailed information about a particular fare or service package. The RuleDescription field typically includes information such as:
  - Baggage Allowance: Free baggage allowance, carry-on baggage allowance, additional baggage fees, etc.
  - Change and Cancellation Policies: Reservation changes, cancellations, refund conditions, etc.
  - Services and Benefits: Included services (meal service, lounge access, extra legroom, etc.).
  - Other Conditions: Special situations, restrictions, additional fees, etc.
- Index 4 ServiceGroup: That categorizes the services and benefits associated with a specific fare class or service package. This field allows for the presentation of services and benefits offered to passengers under specific groups.

### ShoppingFile/AirBookings/BrandedFares/FreeBaggageAllowance

##### ShoppingFile/AirBookings/BrandedFares/FreeBaggageAllowance/PaxBaggageAllowance

- Index 1 Allowance: The "allowance" method is commonly used to access information about passengers' baggage entitlements, detailing how much luggage they can carry. This method may include specifics such as the maximum weight and dimensions allowed for both carry-on and checked baggage. Additionally, it can provide information on fees for excess baggage and regulations for special items, such as sports equipment or musical instruments.
- Index 2 Category: Specifies the type of baggage.
  - Example: "Checked" indicates that the baggage is checked in at the airport and transported in the aircraft's cargo hold.
  - Example: "Cabin" indicates that the baggage is carried into the cabin by the passenger and stored in the overhead bin or under the seat.
- Index 3 Type: Defines how the quantity of the baggage is measured.
  - Example: "Weight" indicates that the baggage is measured based on its weight.
  - Example: "Piece" indicates that the baggage is measured based on the number of pieces.
- Index 4 Unit: Indicates the unit of measurement for the baggage.
  - Example: "K" represents “Kilograms”.
  - Example: "N" represents "Piece".
- Index 5 PaxType: It refers to the classification of passengers based on their age and status. It is important for ticket pricing, baggage allowance, service level, and other passenger services. The PaxType field helps airlines and travel agencies accurately classify passenger information and develop appropriate service and pricing strategies for each passenger type.

### ShoppingFile/AirBookings/Segments

- Index 1 SegmentId: SegmentId is an identifier that represents the identity of a specific flight or flight segment. Particularly in cases of multi-stop or connecting flights, there are different SegmentIds for each flight section. This allows passengers and systems to understand which part of a particular flight is being referred to.
- Index 2 ArrivalDay: It indicates the day when the airplane reaches its destination. This information provides users with details about the flight's arrival date and day.
- Index 3 ArrivalTime: "ArrivalTime" refers to the arrival time of the flight. This field indicates the time when the flight lands at the designated destination airport.
- Index 4 BookingClass: "BookingClass" refers to the flight reservation class. This field indicates the class in which the passenger will travel during the flight and is usually represented by a single letter. For example: Economy, Business, First, Comfort.
- Index 5 DepartureDay: "DepartureDay" refers to the departure day of the flight. This field indicates the scheduled departure date of the flight and is usually presented in date format (e.g., YYYY-MM-DD).
- Index 6 DepartureTime: "DepartureTime" refers to the departure time of the flight. This field indicates the scheduled departure time of the flight and is usually presented in hour and minute format (e.g., HH).
- Index 7 DestinationCode: "DestinationCode" refers to the destination of the flight. This field indicates the code of the airport where the flight will arrive. Usually, three-letter airport codes determined by IATA are used. Example: JFK: New York John F. Kennedy Airport; LHR: London Heathrow Airport; CDG: Paris Charles de Gaulle Airport.
- Index 8 Duration: "Duration" refers to the total duration of the flight. This field indicates the time elapsed from the departure point to the arrival point and is presented in minutes.
- Index 9 Equipment: Refers to the type or model of aircraft used for the flight. This field indicates which aircraft model will be used for a specific flight segment and is usually presented in three-letter codes determined by IATA.
- Index 10 FareBasis: "FareBasis" refers to the basic fare code that determines the pricing rules and conditions of the ticket. This code defines the fare class applicable to a flight and the flexibility, change, and cancellation conditions of the ticket. It is usually presented as a combination of letters and numbers (e.g., Y26, QFL, or E14NR). The FareBasis field indicates the pricing rules and conditions under which the ticket is sold.
- Index 11 FareType: It refers to the fare type or tariff of the booked ticket. The 'FareType' indicates which fare category or class the ticket belongs to.
- Index 12 FlightNumber: "FlightNumber" refers to the number that identifies a specific flight. This number is uniquely assigned to each flight by the airline and is usually used in conjunction with the airline code. Example: "BA123" denotes a British Airways flight, while "TK270" refers to a Turkish Airlines flight.
- Index 13 MarketingAirline: Refers to the airline that markets and sells the flight. This airline is considered the brand that appears during the booking and ticketing process and is usually represented by a two-letter code assigned by IATA. Example: AA: American Airlines; TK: Turkish Airlines; BA: British Airways.
- Index 14 OD_DestinationCode: "OD_DestinationCode" refers to the final destination of the trip.
- Index 15 OD_OriginCode: "OD_OriginCode" refers to the origin point of the flight.
- Index 16 OperatingAirline: "OperatingAirline" refers to the airline that actually operates the flight. This field may differ from the airline that markets or tickets the flight (MarketingAirline).
- Index 17 OriginCode: "OriginCode" refers to the origin point of the flight. This field indicates the code of the airport where the flight begins and usually uses the three-letter airport codes determined by IATA.
- Index 18 SelectedBrandedFareItemId: It is a unique identifier representing the selected branded fare type for a specific flight segment.
- Index 19 SequenceNo: "SequenceNo" refers to the number that indicates the order or position of a specific segment in a flight search. This field is used to denote the sequence of each segment in cases where there are multiple flight segments.
  - Example:
    - Segment 1: Istanbul (IST) -> London (LHR)
    - Segment 2: London (LHR) -> New York (JFK)
    - SequenceNo values: Segment 1 = 1; Segment 2 = 2

## ShoppingFile/CustomerInfo

- Index 1 BusinessId: It refers to the unique identifier of the customer making the reservation or transaction (usually a company or business). This parameter is typically an identification number used for corporate clients.
- Index 2 BusinessName: It refers to the name of the commercial entity or company that makes the reservation or handles the ticketing process. This parameter is used to identify the company responsible for the booking, especially in corporate or business-related travel.
- Index 3 Email: It refers to the email address of the customer who made the reservation or received information about the flight.
- Index 4 Key: It refers to a unique identifier used to define or access customer information. This field is used to ensure that the information related to a customer or passenger is accurately processed and managed within the system.
- Index 5 Phone: It refers to the phone number of the customer or passenger. This field is used to communicate with the customer, provide updates during the reservation process, or contact them in case of emergencies.
- Index 6 Username: It refers to the username of the customer who made the reservation or transaction. This username is used to identify and manage the customer's information and account.

## ShoppingFile/Passengers

### ShoppingFile/Passengers/Passenger

- Index 1 BirthDate: It refers to the passenger's date of birth. The 'BirthDate' parameter should be in the correct format, which is YYYY-MM-DD.
- Index 2 CitizenNo: For domestic flights within Turkey, Turkish citizens are required to provide their National ID number, while non-Turkish citizens must enter 11 zeros (00000000000).
- Index 3 Email: It refers to the email address of the customer who made the reservation or received information about the flight.
- Index 4 FirstName: The 'FirstName' parameter refers to the passenger's First Name and the Middle Name also(if any). If there are more than one name, then all the names need to be written without any blank between them.
  - Wrong spelling: `<FirstName>JOHN SPENCER</FirstName>`
  - Correct spelling: `<FirstName>JOHNSPENCER</FirstName>`
- Index 5 Gender: The 'Gender' parameter refers to the passenger's gender. This parameter is typically indicated as 'M' (Male) or 'F' (Female).
- Index 6 IfContact: This field typically indicates whether a passenger is designated as the contact person in the passenger information.
  - true: This passenger is the primary contact person for the reservation.
  - false: This passenger is not the contact person.
- Index 7 LastName: The 'LastName' parameter refers to the passenger's last name.
- Index 8 Nationality: The 'Nationality' parameter refers to the passenger's nationality or citizenship information. This parameter is typically entered using the two-letter ISO country code (e.g., 'TR' for Turkey, 'US' for the United States).
- Index 9 PassportCountry: The 'PassportCountry' parameter refers to the country that issued the passenger's passport. This parameter is typically specified in country code format and is used to validate passport information.
- Index 10 PassportNo: It refers to the passenger's passport number. This parameter is used to verify the passenger's identity for international flights.
- Index 11 PassportValidDate: The 'PassportValidDate' parameter indicates the expiration date of the passenger's passport. This date is typically provided in the YYYY-MM-DD format and shows until which date the passport is valid.
- Index 12 Phone: The 'Phone' parameter refers to the passenger's phone number.
- Index 13 Type: The 'Type' parameter specifies the passenger's ticketing or reservation type. This parameter is typically used to define the passenger's age group or fare class. Standard 'Type' values used in the aviation industry include:
  - 'ADT' (Adult): Adult passenger (typically 12 years and older)
  - 'CHD' (Child): Child passenger (between 2-11 years old)
  - 'INF' (Infant): Infant passenger (0-2 years old, traveling on lap)
- Index 14 WheelChairServiceType: It is a parameter that indicates whether the passenger requires wheelchair service:
  - 0 → No wheelchair service requested (default).
  - 1 → Wheelchair service requested at the airport.

### ShoppingFile/Passengers/Passenger/PaxReferences

#### ShoppingFile/Passengers/Passenger/PaxReferencesForwardPaxReference

- Index 1 ProductId: It refers to the unique identifier of a specific product or service that has been purchased or priced. This identifier is used to track and manage each product or service within the system.
- Index 2 ProductItemId: This element contains a unique identifier (UUID) corresponding to a specific product item within the Trevoo.WS.Entities.Shopping schema. For example, the value `289af8a3-554b-469c-b28a-7ace0feb5487` uniquely identifies the product item associated with this XML entity.

## ShoppingFile/PriceSummary

- Index 1 GrandTotal: It refers to the total final amount the passenger is required to pay for a reservation.

### ShoppingFile/PriceSummary/PriceItems

#### ShoppingFile/PriceSummary/PriceItems/PriceItem

- Index 1 InCart: It indicates whether the relevant fee or ticket is currently in the shopping cart. This parameter is used to determine the stage of the transaction process and the status of the ticket in the reservation workflow.
  - True
  - False
- Index 2 ProductId: It refers to the unique identifier of a specific product or service that has been purchased or priced. This identifier is used to track and manage each product or service within the system.
- Index 3 ProductType: It refers to the type of the service or product being priced.
- Index 4 Total: It refers to the total amount to be paid for the reservation or ticket.
