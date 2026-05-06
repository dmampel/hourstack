# Specification: Payment Management

## Requirements

### Requirement: Session Payment Status
Each session MUST have a payment status to track whether it has been settled.

#### Scenario: Mark Session as Paid
- GIVEN a session with `isPaid: false`
- WHEN the user clicks the payment indicator
- THEN the session's `isPaid` MUST become `true`
- AND the `paidAt` timestamp MUST be recorded

### Requirement: Bulk Payment
The system MUST allow marking multiple sessions as paid at once.

#### Scenario: Mark Multiple Sessions as Paid
- GIVEN multiple sessions in a "Pending" state
- WHEN the user selects them and clicks "Mark as Paid"
- THEN all selected sessions MUST have `isPaid: true`

### Requirement: Financial Aggregation
The dashboard MUST separate earnings by payment status.

#### Scenario: Display Earnings Breakdown
- GIVEN a mix of paid and pending sessions
- THEN the dashboard MUST show:
  - "Total Paid" (Sum of earnings where `isPaid: true`)
  - "Total Pending" (Sum of earnings where `isPaid: false`)

### Requirement: Filtering
The user MUST be able to filter the session list by payment status.

#### Scenario: Show Only Pending Sessions
- GIVEN a list of sessions
- WHEN the user selects the "Pending" filter
- THEN only sessions with `isPaid: false` MUST be displayed
