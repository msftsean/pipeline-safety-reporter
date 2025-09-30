-- Pipeline Safety Reporter Database Schema
-- Following safety-first principles with proper indexing and constraints

-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE problem_category AS ENUM (
    'gas_leak_odor',
    'visible_pipeline_damage', 
    'construction_near_pipeline',
    'erosion_ground_disturbance',
    'vegetation_management_issue',
    'other_safety_concern'
);

CREATE TYPE severity_level AS ENUM (
    'low',      -- Minor concern, routine inspection needed
    'medium',   -- Potential safety issue, investigation recommended  
    'high',     -- Serious safety concern, prompt response needed
    'critical'  -- Immediate safety threat, emergency response required
);

CREATE TYPE report_status AS ENUM (
    'new',
    'under_review', 
    'resolved',
    'dismissed'
);

-- Main reports table with geospatial support
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Geospatial data (SRID 4326 = WGS84 for GPS coordinates)
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    
    -- Report content
    problem_category problem_category NOT NULL,
    severity_level severity_level NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) <= 500),
    weather_conditions TEXT CHECK (char_length(weather_conditions) <= 100),
    
    -- Optional contact info (encrypted when provided)
    contact_info TEXT,
    
    -- Photo storage (array of Azure blob URLs)
    photos TEXT[] DEFAULT '{}',
    
    -- Administrative fields
    status report_status DEFAULT 'new' NOT NULL,
    admin_notes TEXT,
    assigned_to TEXT, -- For future admin assignment feature
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields for safety compliance
    created_by_ip INET, -- For rate limiting and abuse prevention
    user_agent TEXT,
    
    -- Constraints for data integrity
    CONSTRAINT valid_description_length CHECK (char_length(description) >= 10),
    CONSTRAINT valid_photo_count CHECK (array_length(photos, 1) <= 5 OR photos = '{}'),
    CONSTRAINT resolved_date_consistency CHECK (
        (status = 'resolved' AND resolved_at IS NOT NULL) OR 
        (status != 'resolved' AND resolved_at IS NULL)
    )
);

-- Indexes for performance optimization
-- Critical for emergency system responsiveness
CREATE INDEX idx_reports_location ON reports USING GIST(location);
CREATE INDEX idx_reports_created_at ON reports (created_at DESC);
CREATE INDEX idx_reports_status ON reports (status);
CREATE INDEX idx_reports_severity ON reports (severity_level);
CREATE INDEX idx_reports_category ON reports (problem_category);

-- Composite indexes for common query patterns
CREATE INDEX idx_reports_status_created ON reports (status, created_at DESC);
CREATE INDEX idx_reports_severity_location ON reports (severity_level, location);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create admin users table for future admin functionality
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Will store bcrypt hash
    role VARCHAR(50) DEFAULT 'reviewer' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for admin authentication
CREATE INDEX idx_admin_users_username ON admin_users (username);
CREATE INDEX idx_admin_users_email ON admin_users (email);

-- Insert some sample problem categories documentation
COMMENT ON TYPE problem_category IS 'Categories of pipeline safety issues that can be reported';
COMMENT ON TYPE severity_level IS 'Severity levels: low=routine, medium=investigation needed, high=prompt response, critical=emergency';
COMMENT ON TYPE report_status IS 'Status tracking: new=just submitted, under_review=being investigated, resolved=issue addressed, dismissed=not actionable';

COMMENT ON TABLE reports IS 'Anonymous pipeline safety incident reports with geospatial data';
COMMENT ON COLUMN reports.location IS 'GPS coordinates in WGS84 (SRID 4326) format';
COMMENT ON COLUMN reports.description IS 'User description of the safety concern (10-500 characters)';
COMMENT ON COLUMN reports.photos IS 'Array of Azure Blob Storage URLs for uploaded photos';
COMMENT ON COLUMN reports.contact_info IS 'Optional encrypted contact information for follow-up';

-- Create a view for public report data (excluding sensitive fields)
CREATE OR REPLACE VIEW public_reports_view AS
SELECT 
    id,
    created_at,
    ST_X(location) as longitude,
    ST_Y(location) as latitude,
    address,
    problem_category,
    severity_level,
    LEFT(description, 200) as description_preview, -- Truncated for privacy
    weather_conditions,
    photos,
    status
FROM reports
WHERE status != 'dismissed'
ORDER BY created_at DESC;

COMMENT ON VIEW public_reports_view IS 'Public view of reports with sensitive data removed';

-- Sample data for testing (optional - remove in production)
-- INSERT INTO reports (location, address, problem_category, severity_level, description, weather_conditions, created_by_ip)
-- VALUES 
--     (ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), 'New York, NY', 'gas_leak_odor', 'high', 'Strong gas odor detected near pipeline marker', 'clear', '192.168.1.1'),
--     (ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326), 'Los Angeles, CA', 'visible_pipeline_damage', 'medium', 'Exposed pipeline section visible after recent rain', 'rainy', '192.168.1.2');

-- Grant permissions (adjust as needed for your deployment)
-- GRANT SELECT ON public_reports_view TO public;
-- GRANT INSERT, SELECT ON reports TO pipeline_reporter_app;