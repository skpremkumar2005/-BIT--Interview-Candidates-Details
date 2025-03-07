const mongoose=require('mongoose');
 const userschema=new mongoose.Schema({
    name:{type:String},
    email:{ type:String},
    password:{type:String},
    role:{type:String},
 })
 const Domain=new mongoose.Schema({
   
      personal_details: {
        full_name: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        contact_number: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        permanent_address: { type: String, required: true },
        current_address: { type: String, required: true }
      },
      educational_details: {
        institution_name: { type: String, required: true },
        degree: { type: String, required: true },
        branch: { type: String, required: true },
        year_of_study: { type: Number, required: true },
        cgpa: { type: Number, required: true },
        expected_graduation_year: { type: Number, required: true }
      },
      identification_documents: {
        aadhaar_number: { type: String, required: true, unique: true },
        pan_card: { type: String, unique: true, sparse: true },
        college_id_card: { type: String },
        resume: { type: String },
        offer_letter: { type: String },
        internship_agreement: { type: String }
      },
      internship_details: {
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        duration_months: { type: Number, required: true },
        mode: { type: String, enum: ["Onsite", "Remote", "Hybrid"], required: true },
        stipend: {
          amount: { type: Number, default: 0 },
          currency: { type: String, default: "INR" }
        },
        work_timings: { type: String, enum: ["Full-time", "Part-time"], required: true },
        reporting_manager: { type: String, required: true }
      },
      skills_preferences: {
        technical_skills: { type: [String], required: true },
        preferred_domain: { type: String, required: true },
        previous_experience: [
          {
            company: { type: String },
            role: { type: String },
            duration_months: { type: Number }
          }
        ]
      },
      banking_details: {
        bank_account_number: { type: String },
        ifsc_code: { type: String },
        bank_name: { type: String },
        branch: { type: String }
      },
      emergency_contact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        contact_number: { type: String, required: true }
      },
      additional_info: {
        medical_conditions: { type: String, default: "None" },
        laptop_availability: { type: Boolean, default: true },
        background_verification_consent: { type: Boolean, default: true }
      }
    },
    { timestamps: true }
 )
//  const Email=new mongoose.Schema({email:{type:String}})
 const Id=new mongoose.Schema({Id:{type:String}})

 const user=mongoose.model('User',userschema);
 const TP=mongoose.model('T&P',Domain);
 const iqac=mongoose.model('iqac',Domain);
 const ps=mongoose.model('ps',Domain);
 const dc=mongoose.model('dc',Domain);
 const rp=mongoose.model('rp',Domain);
 const sp=mongoose.model('sp',Domain);
//  const em=mongoose.model('Email',Email);
 const id=mongoose.model('id',Id);




 
 module.exports={user,TP,iqac,ps,dc,rp,sp,id};