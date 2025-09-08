-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  media_urls TEXT[],
  hashtags TEXT[],
  platforms TEXT[],
  category VARCHAR(100),
  tags TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  template_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics data table
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_value INTEGER DEFAULT 0,
  date_recorded DATE DEFAULT CURRENT_DATE,
  additional_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media library table (for actual media files)
CREATE TABLE IF NOT EXISTS media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  dimensions VARCHAR(50),
  alt_text TEXT,
  tags TEXT[],
  folder VARCHAR(255),
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update team_members to reference workspaces properly
ALTER TABLE team_members 
ADD CONSTRAINT fk_workspace 
FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

-- Folders table for organizing content
CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  folder_type VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template categories table
CREATE TABLE IF NOT EXISTS template_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default template categories
INSERT INTO template_categories (name, description, icon, color) VALUES
('Social Media', 'Templates for social media posts', 'share-2', 'blue'),
('Marketing', 'Marketing and promotional templates', 'megaphone', 'green'),
('Announcements', 'Announcement and news templates', 'bell', 'yellow'),
('Events', 'Event promotion templates', 'calendar', 'purple'),
('Products', 'Product showcase templates', 'package', 'orange'),
('Personal', 'Personal and lifestyle templates', 'user', 'pink'),
('Business', 'Business and corporate templates', 'briefcase', 'gray'),
('Seasonal', 'Holiday and seasonal templates', 'sun', 'red');

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE templates;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_data;
ALTER PUBLICATION supabase_realtime ADD TABLE media_files;
ALTER PUBLICATION supabase_realtime ADD TABLE workspaces;
ALTER PUBLICATION supabase_realtime ADD TABLE folders;
ALTER PUBLICATION supabase_realtime ADD TABLE template_categories;

-- Create indexes for better performance
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_is_favorite ON templates(is_favorite);
CREATE INDEX idx_templates_created_at ON templates(created_at);

CREATE INDEX idx_analytics_user_id ON analytics_data(user_id);
CREATE INDEX idx_analytics_post_id ON analytics_data(post_id);
CREATE INDEX idx_analytics_platform ON analytics_data(platform);
CREATE INDEX idx_analytics_date ON analytics_data(date_recorded);

CREATE INDEX idx_media_files_user_id ON media_files(user_id);
CREATE INDEX idx_media_files_file_type ON media_files(file_type);
CREATE INDEX idx_media_files_folder ON media_files(folder);

CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);