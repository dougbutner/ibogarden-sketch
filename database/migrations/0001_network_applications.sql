-- Run on production if network_applications is missing (check admin dashboard or SHOW TABLES).

CREATE TABLE IF NOT EXISTS network_applications (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  organization_name     VARCHAR(255)    NOT NULL,
  email                 VARCHAR(255)    NOT NULL,
  country               VARCHAR(128)    NOT NULL,
  partner_type_id       BIGINT UNSIGNED NOT NULL,
  credentials           TEXT            NULL,
  gabon_first_sourcing  TINYINT(1)      NOT NULL DEFAULT 0,
  southeast_africa      TINYINT(1)      NOT NULL DEFAULT 0,
  solana_wallet         VARCHAR(44)     NULL,
  status                ENUM('pending','in_review','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  reviewer_note         TEXT            NULL,
  reviewed_at           DATETIME        NULL,
  reviewed_by           VARCHAR(255)    NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_network_applications_status (status),
  KEY idx_network_applications_email (email),
  CONSTRAINT fk_network_applications_partner_type
    FOREIGN KEY (partner_type_id) REFERENCES taxonomy_terms (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
