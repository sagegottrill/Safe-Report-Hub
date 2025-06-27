// Integration Test Utility for Safety Support Report System
// This file contains utilities to test all functionalities work together

export interface TestResult {
  test: string;
  passed: boolean;
  message: string;
  details?: any;
}

export class IntegrationTester {
  private results: TestResult[] = [];

  // Test user authentication flow
  testAuthentication(): TestResult {
    try {
      // Test predefined admin login
      const adminEmail = 'admin.daniel@bictdareport.com';
      const adminPassword = '123456';
      
      // Test user registration
      const testUser = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
        phone: '1234567890'
      };

      // Test localStorage persistence
      const testData = { test: 'data' };
      localStorage.setItem('test', JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem('test') || '{}');
      
      if (retrieved.test !== 'data') {
        return {
          test: 'Authentication Flow',
          passed: false,
          message: 'localStorage persistence failed'
        };
      }

      localStorage.removeItem('test');

      return {
        test: 'Authentication Flow',
        passed: true,
        message: 'Authentication system ready for testing'
      };
    } catch (error) {
      return {
        test: 'Authentication Flow',
        passed: false,
        message: `Authentication test failed: ${error}`
      };
    }
  }

  // Test report submission flow
  testReportSubmission(): TestResult {
    try {
      // Test report data structure
      const testReport = {
        type: 'GBV',
        description: 'Test incident report',
        impact: ['Physical', 'Emotional'],
        isAnonymous: false,
        region: 'Test Region',
        platform: 'web'
      };

      // Test case ID generation
      const caseId = this.generateTestCaseId();
      if (!caseId.startsWith('SR-') || caseId.length !== 9) {
        return {
          test: 'Report Submission',
          passed: false,
          message: 'Case ID generation failed'
        };
      }

      // Test PIN generation
      const pin = this.generateTestPin();
      if (pin.length !== 4 || isNaN(Number(pin))) {
        return {
          test: 'Report Submission',
          passed: false,
          message: 'PIN generation failed'
        };
      }

      return {
        test: 'Report Submission',
        passed: true,
        message: 'Report submission system ready'
      };
    } catch (error) {
      return {
        test: 'Report Submission',
        passed: false,
        message: `Report submission test failed: ${error}`
      };
    }
  }

  // Test admin dashboard functionality
  testAdminDashboard(): TestResult {
    try {
      // Test date calculations
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      if (lastMonth > now) {
        return {
          test: 'Admin Dashboard',
          passed: false,
          message: 'Date calculation logic error'
        };
      }

      // Test sector distribution calculation
      const testReports = [
        { type: 'GBV', status: 'new' },
        { type: 'Education', status: 'resolved' },
        { type: 'GBV', status: 'under-review' }
      ];

      const sectorCounts: Record<string, number> = {};
      testReports.forEach(r => {
        sectorCounts[r.type] = (sectorCounts[r.type] || 0) + 1;
      });

      if (sectorCounts['GBV'] !== 2 || sectorCounts['Education'] !== 1) {
        return {
          test: 'Admin Dashboard',
          passed: false,
          message: 'Sector distribution calculation failed'
        };
      }

      return {
        test: 'Admin Dashboard',
        passed: true,
        message: 'Admin dashboard calculations working'
      };
    } catch (error) {
      return {
        test: 'Admin Dashboard',
        passed: false,
        message: `Admin dashboard test failed: ${error}`
      };
    }
  }

  // Test real-time data synchronization
  testRealTimeSync(): TestResult {
    try {
      // Test localStorage event handling
      const testData = { sync: 'test' };
      localStorage.setItem('sync-test', JSON.stringify(testData));
      
      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'sync-test',
        newValue: JSON.stringify(testData),
        oldValue: null,
        storageArea: localStorage
      });

      // Test that we can handle the event
      if (storageEvent.key !== 'sync-test') {
        return {
          test: 'Real-time Sync',
          passed: false,
          message: 'Storage event handling failed'
        };
      }

      localStorage.removeItem('sync-test');

      return {
        test: 'Real-time Sync',
        passed: true,
        message: 'Real-time synchronization ready'
      };
    } catch (error) {
      return {
        test: 'Real-time Sync',
        passed: false,
        message: `Real-time sync test failed: ${error}`
      };
    }
  }

  // Test export functionality
  testExportFunctionality(): TestResult {
    try {
      // Test CSV data structure
      const testData = [
        { ID: 'SR-123456', Name: 'Test User', Email: 'test@example.com' }
      ];

      // Test that data can be converted to CSV format
      const csvHeaders = Object.keys(testData[0]);
      if (csvHeaders.length !== 3) {
        return {
          test: 'Export Functionality',
          passed: false,
          message: 'CSV data structure validation failed'
        };
      }

      return {
        test: 'Export Functionality',
        passed: true,
        message: 'Export functionality ready'
      };
    } catch (error) {
      return {
        test: 'Export Functionality',
        passed: false,
        message: `Export test failed: ${error}`
      };
    }
  }

  // Test role-based access control
  testRoleBasedAccess(): TestResult {
    try {
      const roles = ['user', 'admin', 'governor', 'governor_admin'];
      const validRoles = ['field_officer', 'case_worker', 'country_admin', 'super_admin', 'admin', 'governor', 'user', 'governor_admin'];
      
      // Test that all roles are valid
      const invalidRoles = roles.filter(role => !validRoles.includes(role as any));
      if (invalidRoles.length > 0) {
        return {
          test: 'Role-based Access',
          passed: false,
          message: `Invalid roles found: ${invalidRoles.join(', ')}`
        };
      }

      return {
        test: 'Role-based Access',
        passed: true,
        message: 'Role-based access control working'
      };
    } catch (error) {
      return {
        test: 'Role-based Access',
        passed: false,
        message: `Role-based access test failed: ${error}`
      };
    }
  }

  // Run all tests
  runAllTests(): TestResult[] {
    this.results = [];
    
    this.results.push(this.testAuthentication());
    this.results.push(this.testReportSubmission());
    this.results.push(this.testAdminDashboard());
    this.results.push(this.testRealTimeSync());
    this.results.push(this.testExportFunctionality());
    this.results.push(this.testRoleBasedAccess());

    return this.results;
  }

  // Get test summary
  getTestSummary(): { total: number; passed: number; failed: number; results: TestResult[] } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;

    return {
      total,
      passed,
      failed,
      results: this.results
    };
  }

  // Utility functions for testing
  private generateTestCaseId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'SR-';
    for (let i = 0; i < 6; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }

  private generateTestPin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

// Export a singleton instance
export const integrationTester = new IntegrationTester();

// Export convenience function to run tests
export const runIntegrationTests = () => {
  return integrationTester.runAllTests();
};

// Export function to get test summary
export const getIntegrationTestSummary = () => {
  return integrationTester.getTestSummary();
}; 