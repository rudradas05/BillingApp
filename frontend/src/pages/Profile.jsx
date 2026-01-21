import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";

const Profile = () => {
  const { token, backendurl } = useContext(AppContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    companyName: "",
    address: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access your profile");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          `${backendurl}/api/user/get-user-data`,
          { headers: { token } }
        );

        if (data.success) {
          setUserData(data.userData);
          setOriginalData(data.userData);
          setFormData({
            name: data.userData.name,
            phoneNumber: data.userData.phoneNumber || "",
            companyName: data.userData.companyName || "",
            address: data.userData.address || "",
          });
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, backendurl, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      name: originalData.name,
      phoneNumber: originalData.phoneNumber || "",
      companyName: originalData.companyName || "",
      address: originalData.address || "",
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data } = await axios.put(
        `${backendurl}/api/user/update-user-data`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        setUserData(data.userData);
        setOriginalData(data.userData);
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-400">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="relative rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 p-6 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl font-semibold">
            {userData.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
            <p className="text-sm text-neutral-400">{userData.email}</p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-sm text-neutral-300 hover:text-cyan-400 transition"
            >
              <FiEdit2 /> Edit
            </button>
          )}
        </div>

        {/* DETAILS */}
        <form
          onSubmit={handleSave}
          className="rounded-2xl bg-neutral-800/60 border border-white/10 p-6 space-y-8"
        >
          <section>
            <h3 className="text-sm font-semibold text-neutral-300 mb-4 uppercase">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input icon={<FiUser />} label="Full Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
              <ReadOnlyInput icon={<FiMail />} label="Email" value={userData.email} />
              <Input icon={<FiPhone />} label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-neutral-300 mb-4 uppercase">
              Business Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input icon={<FiBriefcase />} label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} disabled={!isEditing} />
              <Input icon={<FiMapPin />} label="Business Address" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} />
            </div>
          </section>

          {isEditing && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 rounded-xl border border-white/10 text-neutral-300 hover:bg-neutral-700 transition flex items-center justify-center gap-2"
              >
                <FiX /> Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-cyan-500 text-black font-semibold py-3 rounded-xl hover:bg-cyan-400 transition flex items-center justify-center gap-2"
              >
                <FiSave />
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const Input = ({ icon, label, disabled, ...props }) => (
  <div>
    <label className="text-xs text-neutral-400 mb-1 block">{label}</label>
    <div className="flex items-center gap-3 bg-neutral-900 border border-white/10 rounded-lg px-4 py-3">
      <span className="text-neutral-400">{icon}</span>
      <input {...props} disabled={disabled} className="w-full bg-transparent outline-none text-sm text-white disabled:text-neutral-400" />
    </div>
  </div>
);

const ReadOnlyInput = ({ icon, label, value }) => (
  <div>
    <label className="text-xs text-neutral-400 mb-1 block">{label}</label>
    <div className="flex items-center gap-3 bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-neutral-400">
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  </div>
);

export default Profile;
