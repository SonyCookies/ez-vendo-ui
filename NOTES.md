TO FIX / IMPLEMENT:

GENERAL:
    - Added simple loading state for every web page (DONE)
     - Implement filter function (TRANSACTION PAGE) (PENDING)
            - Sort by:
                - Date
                - Amount

BRANCHES:
1. ui-layout-v2
    a. DASHBOARD:
        - Outer and middle circle when in Stop state (DONE)
        - Stop button: (DONE)
            - Implement a warning modal when the user's credit is 10.00 and below (DONE)
            - Implement a stop confirmation modal (DONE)
                - Implement a post-stop confirmation modal (DONE)
        - Implement Top-up Instructions (DONE)
        - Implement Recent transactions (display 3 transactions only) (DONE)
    
    b. REGISTER:
        - Added static attempts text (DONE)

    c. TRANSACTIONS:
        - Implement Transaction Page (DONE)

    d. PROFILE:
        - Implement Profile Page (DONE)

2. transaction-page
    a. Transaction Page: (DONE)
        - Implement:
            - Today's Transactions (DONE)
            - Yesterday's Transactions (DONE)
            - Last 7 Day's Transactions (DONE)
        - Implement a specific modal for certain transaction logs: (DONE)
            Fields:
                - Rfid No. (DONE)
                - Account Name (DONE)
                - Transaction Id (DONE)
                - Amount (DONE)
       
    b. Home
        - WAN Status Modal: (DONE)
            - Show Disconnected Modal whenever the internet communication is down or do not have any internet connectivity
    
    c. Dashboard:
        - Implement a specific modal for certain transaction logs:
            Fields:
                - Rfid No.(DONE)
                - Account Name (DONE)
                - Transaction Id (DONE)
                - Amount (DONE)

3. profile-page
    a. Implement profile page:
        - Fields:
            - Profile Card:
                - Profile image (DONE)
                - Name (DONE)
                - RFID (DONE)
                - Edit button (DONE)
            - Details / Information
                - Email (DONE)
                - Phone (DONE)
                - Birth date (DONE)
                - Gender (DONE)
                - Age (DONE)
                - Address (DONE)
    b. Implement Edit Profile Page: (PENDING)
        - Preview of upload photo
            - show the remove preview photo button when there's a preview image
        - For unset fields, the default value must be "N/A"
    c. Implement deactivate account: (DONE)
        - Pre-Deactivate Modal: (DONE)
            - When the user press "Deactivate account", a modal will show up confirming the user
        - Post-Deactivate Modal: (DONE)
            - When the user confirm the deactivation of account, the user is prompt to enter their password


        
        
    
