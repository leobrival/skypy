# Changelog

All notable changes to Skypy will be documented in this file.

---

## v1.2.1

**November 22, 2025**

### URL Validation & UX Improvements

This release focuses on improving the user experience when creating short links by adding intelligent URL validation and conditional field enabling.

#### New

- **Real-time URL Validation**: Destination URL field now validates input in real-time using native browser validation
- **Conditional Field Disabling**: UTM parameters and custom parameters are automatically disabled until a valid destination URL is entered
- **Smart Protocol Handling**: System now accepts both HTTP and HTTPS URLs without forcing auto-correction
- **Visual Feedback**: Disabled fields show clear visual indicators and helpful tooltips explaining why they're disabled

#### Improvements

- **Removed Auto-correction**: No longer automatically adds `https://` to prevent false positives (e.g., "fugi" → "<https://fugi>")
- **HTTP Support**: Properly supports HTTP URLs alongside HTTPS without forcing protocol changes
- **Better Tooltips**: French-language tooltips guide users to enter a valid URL first
- **Clearer Placeholders**: Updated placeholder from "example.com or https://..." to "<https://example.com>" for clarity
- **Improved Help Text**: Added French help text explaining protocol requirement

#### Bug Fixes

- **Fixed Remember Me Error**: Removed `remember` parameter from login controller to fix RuntimeException when `useRememberMeTokens` is disabled
- **Prevented Invalid URLs**: Users can no longer add UTM parameters or custom parameters to invalid destination URLs

#### Technical

- Added `isValidUrl()` validation function using native URL constructor
- Added `hasValidUrl` state to track destination URL validity
- Added `disabled={!hasValidUrl}` prop to all UTM input fields (5 fields)
- Added `disabled={!hasValidUrl}` prop to preset dropdown with tooltip
- Added `disabled={!hasValidUrl}` prop to custom parameters inputs and buttons
- Removed `onBlur` auto-correction logic that was adding unwanted protocols
- Updated `auth_controller.ts` to remove unused `remember` parameter

---

## v1.2.0

**November 21, 2025**

### Advanced UTM Tracking & Custom Parameters

This release brings enterprise-level UTM tracking features to Skypy, giving you complete control over your link analytics and marketing attribution.

![UTM Presets Feature](/public/changelog/v1.2.0-utm-presets.png)

We've completely revamped the UTM experience with powerful new features inspired by enterprise tools like Bitly. Save time with reusable presets, and gain flexibility with custom URL parameters for affiliate tracking, referral programs, and more.

#### New

- **UTM Presets**: Save your most-used UTM parameter combinations as reusable templates
- **Default Preset**: Set a default preset to auto-apply when creating new links
- **Custom URL Parameters**: Add custom key-value parameters beyond standard UTM tags (e.g., `ref`, `affiliate_id`, `partner`)
- **Preset Management Page**: Full CRUD interface at `/utm-presets` to manage all your presets
- **Preset Selector**: Quick dropdown to apply presets in both create and edit forms

#### Improvements

- **UTM Field Auto-Clear**: UTM fields now automatically clear when the destination URL is emptied
- **Reduced UI Flash**: Optimized state updates to prevent unnecessary re-renders when clearing fields
- **Cleaner Interface**: Removed the intermittent blue preview box for a cleaner form experience
- **Bidirectional UTM Sync**: UTM parameters stay synchronized between form fields and destination URL

#### Technical

- New `utm_presets` database table with user relationship
- New `custom_params` JSONB column on links table
- Updated validators for custom parameters validation
- Custom parameters automatically appended to redirect URLs

---

## v1.1.0

**November 20, 2025**

### UTM Parameter Support

This release introduces comprehensive UTM tracking capabilities, allowing you to track the effectiveness of your marketing campaigns directly through Skypy.

![UTM Parameters](/public/changelog/v1.1.0-utm-parameters.png)

Track your link performance with industry-standard UTM parameters. Whether you're running email campaigns, social media promotions, or paid advertising, Skypy now helps you understand exactly where your traffic comes from.

#### New

- **5 Standard UTM Parameters**: Full support for `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`
- **Auto-Parse from URL**: Paste a URL with existing UTM parameters and watch them auto-populate in the form
- **Multi-Value Support**: Use commas to add multiple values for any UTM parameter
- **Real-Time URL Building**: UTM parameters are automatically appended to your destination URL

#### Improvements

- **Form Validation**: Server-side validation for all UTM parameters with length limits
- **Helpful Descriptions**: Each UTM field includes guidance on proper usage
- **Analytics Display**: UTM parameters visible in link listings for quick reference

---

## v1.0.0

**November 19, 2025**

### Initial Release - Link Shortening Platform

Skypy launches as a modern, self-hosted alternative to Linktree with powerful link shortening capabilities.

![Skypy Dashboard](/public/changelog/v1.0.0-dashboard.png)

Introducing Skypy, your all-in-one link management platform. Create beautiful landing pages, shorten URLs, and track clicks - all from a single, elegant dashboard.

#### New

- **Short Links**: Create memorable short URLs with custom or auto-generated codes
- **Landing Pages**: Build beautiful link-in-bio style pages with custom themes
- **Click Tracking**: Monitor link performance with real-time click counting
- **User Authentication**: Secure registration and login system
- **Link Management**: Full CRUD operations for links and pages
- **Active/Inactive Toggle**: Disable links without deleting them
- **Custom Short Codes**: Choose your own memorable short codes

#### Technical Stack

- **Backend**: AdonisJS 6 with Lucid ORM
- **Frontend**: React with Inertia.js for seamless SPA experience
- **Database**: PostgreSQL for reliable data storage
- **UI**: Tailwind CSS with shadcn/ui components
- **Authentication**: Session-based auth with secure password hashing

---

## Roadmap

Upcoming features we're working on:

- **QR Code Generation**: Generate QR codes for any short link
- **Advanced Analytics**: Detailed click analytics with geographic and device data
- **Team Workspaces**: Collaborate with team members on shared links
- **API Access**: RESTful API for programmatic link management
- **Bulk Import/Export**: Import and export links in CSV format
- **Link Scheduling**: Schedule links to activate/deactivate at specific times
