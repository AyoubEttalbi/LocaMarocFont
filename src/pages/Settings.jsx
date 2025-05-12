import { useState } from "react"
import { Save, SettingsIcon, Bell, Shield, Globe, Mail, Phone, Lock, Building, Clock } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import "./settings.css"
import DashboardLayout from "./DashboardLayout"

// Form schemas
const profileFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
})

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(true),
  newBookingAlert: z.boolean().default(true),
  bookingCancellationAlert: z.boolean().default(true),
  paymentReceivedAlert: z.boolean().default(true),
  systemUpdates: z.boolean().default(false),
})

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const businessSettingsFormSchema = z.object({
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  timezone: z.string().min(1, {
    message: "Please select a timezone.",
  }),
  dateFormat: z.string().min(1, {
    message: "Please select a date format.",
  }),
  bookingLeadTime: z.coerce.number().min(0, {
    message: "Lead time cannot be negative.",
  }),
  minRentalDuration: z.coerce.number().min(1, {
    message: "Minimum rental duration must be at least 1 day.",
  }),
  maxRentalDuration: z.coerce.number().min(1, {
    message: "Maximum rental duration must be at least 1 day.",
  }),
})

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Initialize forms
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: "LocaMaroc Car Rental",
      email: "contact@locamaroc.com",
      phone: "+212 522 123 456",
      address: "123 Avenue Mohammed V, Casablanca, Morocco",
      website: "https://locamaroc.com",
      description: "Premium car rental service in Morocco offering a wide range of vehicles for all your needs.",
    },
  })

  const notificationsForm = useForm({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      newBookingAlert: true,
      bookingCancellationAlert: true,
      paymentReceivedAlert: true,
      systemUpdates: false,
    },
  })

  const securityForm = useForm({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const businessSettingsForm = useForm({
    resolver: zodResolver(businessSettingsFormSchema),
    defaultValues: {
      currency: "MAD",
      timezone: "Africa/Casablanca",
      dateFormat: "DD/MM/YYYY",
      bookingLeadTime: 24,
      minRentalDuration: 1,
      maxRentalDuration: 30,
    },
  })

  // Form submission handlers
  const onProfileSubmit = (data) => {
    setIsSaving(true)
    console.log("Profile data:", data)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const onNotificationsSubmit = (data) => {
    setIsSaving(true)
    console.log("Notifications data:", data)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const onSecuritySubmit = (data) => {
    setIsSaving(true)
    console.log("Security data:", data)
    setTimeout(() => {
      setIsSaving(false)
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  const onBusinessSettingsSubmit = (data) => {
    setIsSaving(true)
    console.log("Business settings data:", data)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  // Custom Switch component
  const CustomSwitch = ({ checked, onChange }) => {
    return (
      <div className="custom-switch-container" onClick={() => onChange(!checked)}>
        <div className={`custom-switch ${checked ? 'active' : ''}`}>
          <div className="custom-switch-thumb"></div>
        </div>
      </div>
    )
  }

  // Custom Select component
  const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedOption = options.find(option => option.value === value)

    return (
      <div className="custom-select-container">
        <div 
          className="custom-select-trigger" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <span className="custom-select-arrow">▼</span>
        </div>
        {isOpen && (
          <div className="custom-select-options">
            {options.map(option => (
              <div 
                key={option.value} 
                className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Form field error message
  const ErrorMessage = ({ children }) => {
    return children ? <p className="error-message">{children}</p> : null
  }

  // Form field description
  const FieldDescription = ({ children }) => {
    return children ? <p className="field-description">{children}</p> : null
  }

  return (
    <DashboardLayout>
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">Manage your account settings and preferences.</p>
      </div>

      <div className="settings-tabs">
        <div className="tabs-list">
          <button 
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <Building className="tab-icon" />
            <span>Business Profile</span>
          </button>
          <button 
            className={`tab-button ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="tab-icon" />
            <span>Notifications</span>
          </button>
          <button 
            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="tab-icon" />
            <span>Security</span>
          </button>
          <button 
            className={`tab-button ${activeTab === "business" ? "active" : ""}`}
            onClick={() => setActiveTab("business")}
          >
            <SettingsIcon className="tab-icon" />
            <span>Business Settings</span>
          </button>
        </div>

        {/* Profile Tab */}
        <div className={`tab-content ${activeTab === "profile" ? "active" : ""}`}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Business Profile</h3>
              <p className="card-description">Update your business information and how it appears to customers.</p>
            </div>
            <div className="card-content">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="form">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    className="form-input"
                    placeholder="Your company name"
                    {...profileForm.register("companyName")}
                  />
                  <ErrorMessage>{profileForm.formState.errors.companyName?.message}</ErrorMessage>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div className="input-with-icon">
                      <Mail className="input-icon" />
                      <input
                        className="form-input"
                        placeholder="email@example.com"
                        {...profileForm.register("email")}
                      />
                    </div>
                    <ErrorMessage>{profileForm.formState.errors.email?.message}</ErrorMessage>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div className="input-with-icon">
                      <Phone className="input-icon" />
                      <input
                        className="form-input"
                        placeholder="+1 (555) 123-4567"
                        {...profileForm.register("phone")}
                      />
                    </div>
                    <ErrorMessage>{profileForm.formState.errors.phone?.message}</ErrorMessage>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    className="form-input"
                    placeholder="123 Street Name, City, Country"
                    {...profileForm.register("address")}
                  />
                  <ErrorMessage>{profileForm.formState.errors.address?.message}</ErrorMessage>
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <div className="input-with-icon">
                    <Globe className="input-icon" />
                    <input
                      className="form-input"
                      placeholder="https://example.com"
                      {...profileForm.register("website")}
                    />
                  </div>
                  <FieldDescription>Your company website URL (optional)</FieldDescription>
                  <ErrorMessage>{profileForm.formState.errors.website?.message}</ErrorMessage>
                </div>

                <div className="form-group">
                  <label className="form-label">Business Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell customers about your business..."
                    {...profileForm.register("description")}
                  ></textarea>
                  <FieldDescription>This will be displayed on your public profile.</FieldDescription>
                  <ErrorMessage>{profileForm.formState.errors.description?.message}</ErrorMessage>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="submit-button"
                >
                  {isSaving ? (
                    <>
                      <div className="spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="button-icon" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Notifications Tab */}
        <div className={`tab-content ${activeTab === "notifications" ? "active" : ""}`}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Notification Preferences</h3>
              <p className="card-description">Configure how and when you receive notifications.</p>
            </div>
            <div className="card-content">
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="form">
                <div className="section">
                  <h4 className="section-title">Communication Channels</h4>
                  <div className="separator"></div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">Email Notifications</label>
                      <p className="toggle-description">Receive notifications via email.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("emailNotifications")} 
                      onChange={(value) => notificationsForm.setValue("emailNotifications", value)}
                    />
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">SMS Notifications</label>
                      <p className="toggle-description">Receive notifications via text message.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("smsNotifications")} 
                      onChange={(value) => notificationsForm.setValue("smsNotifications", value)}
                    />
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">Marketing Emails</label>
                      <p className="toggle-description">Receive emails about new features and promotions.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("marketingEmails")} 
                      onChange={(value) => notificationsForm.setValue("marketingEmails", value)}
                    />
                  </div>
                </div>

                <div className="section">
                  <h4 className="section-title">Notification Types</h4>
                  <div className="separator"></div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">New Booking Alerts</label>
                      <p className="toggle-description">Get notified when a new booking is made.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("newBookingAlert")} 
                      onChange={(value) => notificationsForm.setValue("newBookingAlert", value)}
                    />
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">Booking Cancellation Alerts</label>
                      <p className="toggle-description">Get notified when a booking is cancelled.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("bookingCancellationAlert")} 
                      onChange={(value) => notificationsForm.setValue("bookingCancellationAlert", value)}
                    />
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">Payment Received Alerts</label>
                      <p className="toggle-description">Get notified when a payment is received.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("paymentReceivedAlert")} 
                      onChange={(value) => notificationsForm.setValue("paymentReceivedAlert", value)}
                    />
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <label className="toggle-label">System Updates</label>
                      <p className="toggle-description">Get notified about system maintenance and updates.</p>
                    </div>
                    <CustomSwitch 
                      checked={notificationsForm.watch("systemUpdates")} 
                      onChange={(value) => notificationsForm.setValue("systemUpdates", value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="submit-button"
                >
                  {isSaving ? (
                    <>
                      <div className="spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="button-icon" />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Security Tab */}
        <div className={`tab-content ${activeTab === "security" ? "active" : ""}`}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Security Settings</h3>
              <p className="card-description">Manage your account security and password.</p>
            </div>
            <div className="card-content">
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="form">
                <div className="section">
                  <h4 className="section-title">Change Password</h4>
                  <div className="separator"></div>

                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="input-with-icon">
                      <Lock className="input-icon" />
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        {...securityForm.register("currentPassword")}
                      />
                    </div>
                    <ErrorMessage>{securityForm.formState.errors.currentPassword?.message}</ErrorMessage>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <div className="input-with-icon">
                        <Lock className="input-icon" />
                        <input
                          type="password"
                          className="form-input"
                          placeholder="••••••••"
                          {...securityForm.register("newPassword")}
                        />
                      </div>
                      <FieldDescription>Password must be at least 8 characters long.</FieldDescription>
                      <ErrorMessage>{securityForm.formState.errors.newPassword?.message}</ErrorMessage>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <div className="input-with-icon">
                        <Lock className="input-icon" />
                        <input
                          type="password"
                          className="form-input"
                          placeholder="••••••••"
                          {...securityForm.register("confirmPassword")}
                        />
                      </div>
                      <ErrorMessage>{securityForm.formState.errors.confirmPassword?.message}</ErrorMessage>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="submit-button"
                >
                  {isSaving ? (
                    <>
                      <div className="spinner"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="button-icon" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Business Settings Tab */}
        <div className={`tab-content ${activeTab === "business" ? "active" : ""}`}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Business Settings</h3>
              <p className="card-description">Configure your business operational settings.</p>
            </div>
            <div className="card-content">
              <form onSubmit={businessSettingsForm.handleSubmit(onBusinessSettingsSubmit)} className="form">
                <div className="form-row three-columns">
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <CustomSelect
                      value={businessSettingsForm.watch("currency")}
                      onChange={(value) => businessSettingsForm.setValue("currency", value)}
                      placeholder="Select currency"
                      options={[
                        { value: "MAD", label: "Moroccan Dirham (MAD)" },
                        { value: "USD", label: "US Dollar (USD)" },
                        { value: "EUR", label: "Euro (EUR)" },
                        { value: "GBP", label: "British Pound (GBP)" }
                      ]}
                    />
                    <ErrorMessage>{businessSettingsForm.formState.errors.currency?.message}</ErrorMessage>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <CustomSelect
                      value={businessSettingsForm.watch("timezone")}
                      onChange={(value) => businessSettingsForm.setValue("timezone", value)}
                      placeholder="Select timezone"
                      options={[
                        { value: "Africa/Casablanca", label: "Africa/Casablanca (GMT+1)" },
                        { value: "Europe/London", label: "Europe/London (GMT)" },
                        { value: "Europe/Paris", label: "Europe/Paris (GMT+1)" },
                        { value: "America/New_York", label: "America/New_York (GMT-5)" }
                      ]}
                    />
                    <ErrorMessage>{businessSettingsForm.formState.errors.timezone?.message}</ErrorMessage>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date Format</label>
                    <CustomSelect
                      value={businessSettingsForm.watch("dateFormat")}
                      onChange={(value) => businessSettingsForm.setValue("dateFormat", value)}
                      placeholder="Select date format"
                      options={[
                        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                        { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
                      ]}
                    />
                    <ErrorMessage>{businessSettingsForm.formState.errors.dateFormat?.message}</ErrorMessage>
                  </div>
                </div>

                <div className="section">
                  <h4 className="section-title">Booking Settings</h4>
                  <div className="separator"></div>

                  <div className="form-row three-columns">
                    <div className="form-group">
                      <label className="form-label">Booking Lead Time (hours)</label>
                      <div className="input-with-icon">
                        <Clock className="input-icon" />
                        <input
                          type="number"
                          min="0"
                          className="form-input"
                          {...businessSettingsForm.register("bookingLeadTime")}
                        />
                      </div>
                      <FieldDescription>Minimum time before pickup</FieldDescription>
                      <ErrorMessage>{businessSettingsForm.formState.errors.bookingLeadTime?.message}</ErrorMessage>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Minimum Rental Duration (days)</label>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        {...businessSettingsForm.register("minRentalDuration")}
                      />
                      <ErrorMessage>{businessSettingsForm.formState.errors.minRentalDuration?.message}</ErrorMessage>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Maximum Rental Duration (days)</label>
                      <input
                        type="number"
                        min="1"
                        className="form-input"
                        {...businessSettingsForm.register("maxRentalDuration")}
                      />
                      <ErrorMessage>{businessSettingsForm.formState.errors.maxRentalDuration?.message}</ErrorMessage>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="submit-button"
                >
                  {isSaving ? (
                    <>
                      <div className="spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="button-icon" />
                      <span>Save Settings</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
