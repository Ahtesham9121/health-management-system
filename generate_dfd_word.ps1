$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$selection = $word.Selection

# Title
$selection.Style = "Title"
$selection.TypeText("Health Management System - Data Flow Diagrams")
$selection.TypeParagraph()

# Intro
$selection.Style = "Normal"
$selection.TypeText("This document provides a visual representation of how data flows through the Health Management System.")
$selection.TypeParagraph()

# Level 0 DFD
$selection.Style = "Heading 1"
$selection.TypeText("Level 0 DFD: Context Diagram")
$selection.TypeParagraph()
$selection.Style = "Normal"
$selection.TypeText("The Context Diagram shows the entire system as a single process and its interaction with external entities.")
$selection.TypeParagraph()
$selection.TypeText("Mermaid Diagram (Copy-paste into a Mermaid live editor to view):")
$selection.TypeParagraph()
$selection.Font.Name = "Courier New"
$selection.TypeText("graph LR")
$selection.TypeParagraph()
$selection.TypeText("    P[Patient]")
$selection.TypeParagraph()
$selection.TypeText("    A[Admin]")
$selection.TypeParagraph()
$selection.TypeText("    S((Health Management System))")
$selection.TypeParagraph()
$selection.TypeText("    P -- 'Registration/Login Info' --> S")
$selection.TypeParagraph()
$selection.TypeText("    P -- 'Search Criteria (Location, Speciality)' --> S")
$selection.TypeParagraph()
$selection.TypeText("    P -- 'Appointment Requests' --> S")
$selection.TypeParagraph()
$selection.TypeText("    S -- 'Appointment Confirmations' --> P")
$selection.TypeParagraph()
$selection.TypeText("    S -- 'Doctor/Hospital Lists' --> P")
$selection.TypeParagraph()
$selection.TypeText("    A -- 'Auth Credentials' --> S")
$selection.TypeParagraph()
$selection.TypeText("    A -- 'Hospital/Doctor Management Data' --> S")
$selection.TypeParagraph()
$selection.TypeText("    A -- 'System Config (States/Cities)' --> S")
$selection.TypeParagraph()
$selection.TypeText("    S -- 'Dashboard Stats / Reports' --> A")
$selection.TypeParagraph()
$selection.Font.Name = "Calibri"

# Level 1 DFD
$selection.Style = "Heading 1"
$selection.TypeText("Level 1 DFD: Process Overview")
$selection.TypeParagraph()
$selection.Style = "Normal"
$selection.TypeText("The Level 1 DFD breaks down the system into its major functional processes and shows data stores.")
$selection.TypeParagraph()
$selection.Font.Name = "Courier New"
$selection.TypeText("graph TD")
$selection.TypeParagraph()
$selection.TypeText("    Patient[Patient]")
$selection.TypeParagraph()
$selection.TypeText("    Admin[Admin]")
$selection.TypeParagraph()
$selection.TypeText("    P1((1.0 Authentication))")
$selection.TypeParagraph()
$selection.TypeText("    P2((2.0 Discovery Service))")
$selection.TypeParagraph()
$selection.TypeText("    P3((3.0 Appointment Booking))")
$selection.TypeParagraph()
$selection.TypeText("    P4((4.0 Admin Management))")
$selection.TypeParagraph()
$selection.TypeText("    D1[(Users DB)]")
$selection.TypeParagraph()
$selection.TypeText("    D2[(Healthcare DB)]")
$selection.TypeParagraph()
$selection.TypeText("    D3[(Appointments DB)]")
$selection.TypeParagraph()
$selection.Font.Name = "Calibri"

# Key Components
$selection.Style = "Heading 1"
$selection.TypeText("Key Components")
$selection.TypeParagraph()
$selection.Style = "Heading 2"
$selection.TypeText("External Entities")
$selection.TypeParagraph()
$selection.Style = "Normal"
$selection.TypeText("- Patient: End-user looking to discover healthcare providers and book appointments.")
$selection.TypeParagraph()
$selection.TypeText("- Admin: Internal user responsible for system maintenance and metadata management.")
$selection.TypeParagraph()

# Save
$filePath = Join-Path $pwd "Health_Management_System_DFD.docx"
$doc.SaveAs([ref]$filePath)
$doc.Close()
$word.Quit()

Write-Host "Word document created at: $filePath"
