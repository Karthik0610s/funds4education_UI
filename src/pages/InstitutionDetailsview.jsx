import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../app/components/header/header";
import "../../src/pages/styles.css"; // global CSS

import { fetchInstitutionList } from "../app/redux/slices/InstitutionlistSlice";

export default function InstitutionViewPage() {
    const { id } = useParams(); // get id from URL
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { institutions, loading } = useSelector(
        (state) => state.institutionList
    );

    // Fetch institutions if empty
    useEffect(() => {
        if (institutions.length === 0) {
            dispatch(fetchInstitutionList());
        }
    }, [dispatch, institutions.length]);

    // Find the institution
    const institution = institutions.find((i) => i.id.toString() === id);

    if (loading) return <p>Loading institution details...</p>;
    if (!institution) return <p>No institution found</p>;

    return (
        <div className="institution-page">
            <Header />

            <div style={{ padding: "20px" }}>
                <button
  className="institution-back-btn"
  onClick={() => navigate(-1)}
>
  ← Back
</button>



                <h2 className="institution-title">{institution.name}</h2>

                {/* BASIC INFO */}
            <h3 className="institution-section">College Details</h3>

                <div className="institution-card">
                    <p><strong>AISHE Code:</strong> {institution.aisheCode}</p>
                    <p><strong>College Type:</strong> {institution.collegeType}</p>
                    <p><strong>Management:</strong> {institution.management}</p>
                    <p><strong>Year Of Establishment:</strong> {institution.yearOfEstablishment}</p>
                    <p><strong>Location:</strong> {institution.location}</p>
                </div>

                {/* LOCATION DETAILS */}
                <h3 className="institution-section">Location Details</h3>
                <div className="institution-card">
                    <p><strong>State:</strong> {institution.state}</p>
                    <p><strong>District:</strong> {institution.district}</p>
                </div>

                {/* UNIVERSITY DETAILS */}
                <h3 className="institution-section">University Details</h3>
                <div className="institution-card">
                    <p><strong>University Name:</strong> {institution.universityName}</p>
                    <p><strong>University AISHE Code:</strong> {institution.universityAisheCode}</p>
                    <p><strong>University Type:</strong> {institution.universityType}</p>
                </div>

                {/* WEBSITE */}
                <h3 className="institution-section">Website</h3>
                <div className="institution-card">
                    {institution.website ? (
                        <a
                            href={
                                institution.website.startsWith("http")
                                    ? institution.website
                                    : `https://${institution.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            {institution.website}
                        </a>
                    ) : (
                        "Not available"
                    )}
                </div>

                {/* CREATED DATE 
                <h3 className="institution-section">Created Date</h3>
                <div className="institution-card">
                    {new Date(institution.createdAt).toLocaleDateString("en-IN")}
                </div>
                */}
            </div>
        </div>
    );
}
