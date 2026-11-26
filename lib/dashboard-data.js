import { cache } from "react";
import { connectDB } from "@/lib/mongodb";
import { Attendance, Coach, Enrollment, MembershipPlan, Payment, Progress, Sport, User } from "@/models";
import { sportsCatalog, coachesCatalog, planCatalog } from "@/data/catalog";
import { getFallbackEnrollment } from "@/lib/fallback-users";
import { getStudentStateFromCookie } from "@/lib/student-state-cookie";
const plain = value => JSON.parse(JSON.stringify(value));
export const getStudentDashboard = cache(async (studentId, studentEmail = null) => {
  let enrollments = [];
  let attendance = [];
  let progress = [];
  let payments = [];
  try {
    if (process.env.MONGODB_URI && studentId && /^[a-f\d]{24}$/i.test(String(studentId))) {
      await connectDB();
      const [dbEnrollments, dbAttendance, dbProgress, dbPayments] = await Promise.all([Enrollment.find({
        student: studentId
      }).sort({
        createdAt: -1
      }).limit(10).populate("sport", "name slug").populate("coach", "name image").populate("membershipPlan", "name price duration").lean(), Attendance.find({
        student: studentId
      }).sort({
        date: -1
      }).limit(100).populate("sport", "name").populate("coach", "name").lean(), Progress.find({
        student: studentId
      }).sort({
        createdAt: -1
      }).limit(12).populate("sport", "name").populate("coach", "name").lean(), Payment.find({
        student: studentId
      }).sort({
        createdAt: -1
      }).limit(20).populate("membershipPlan", "name duration price").populate("sport", "name").populate("coach", "name").lean()]);
      if (Array.isArray(dbEnrollments) && dbEnrollments.length) enrollments = dbEnrollments;
      if (Array.isArray(dbAttendance) && dbAttendance.length) attendance = dbAttendance;
      if (Array.isArray(dbProgress) && dbProgress.length) progress = dbProgress;
      if (Array.isArray(dbPayments) && dbPayments.length) payments = dbPayments;
    }
  } catch (err) {
    console.warn("getStudentDashboard MongoDB query skipped/failed:", err.message);
  }
  const fallback = getFallbackEnrollment(studentId);
  const cookieState = studentEmail ? await getStudentStateFromCookie(studentEmail) : null;
  const current = enrollments.find(item => item.status === "active") || fallback || cookieState?.enrollment || null;
  const safePayments = payments.length ? payments : cookieState?.payment ? [cookieState.payment] : [];
  const safeAttendance = attendance;
  const safeProgress = progress;
  const present = safeAttendance.filter(item => item.status === "present").length;
  const latestProgress = safeProgress[0] || null;
  return plain({
    enrollments: current ? enrollments.length ? enrollments : [current] : [],
    attendance: safeAttendance,
    progress: safeProgress,
    payments: safePayments,
    currentEnrollment: current,
    latestProgress,
    summary: {
      attendanceRate: safeAttendance.length ? Math.round(present / safeAttendance.length * 100) : 0,
      progress: latestProgress?.overallProgress || 0,
      skillLevel: latestProgress?.skillLevel || "Getting started",
      totalSessions: safeAttendance.length,
      presentSessions: present
    },
    configured: true
  });
});
export const getCoachDashboard = cache(async coachId => {
  let enrollments = [];
  let attendance = [];
  let progress = [];
  try {
    if (process.env.MONGODB_URI && coachId) {
      await connectDB();
      const [dbEnrollments, dbAttendance, dbProgress] = await Promise.all([Enrollment.find({
        coach: coachId,
        status: "active"
      }).sort({
        createdAt: -1
      }).limit(100).populate("student", "name email image").populate("sport", "name").populate("membershipPlan", "name endDate").lean(), Attendance.find({
        coach: coachId
      }).sort({
        date: -1
      }).limit(250).lean(), Progress.find({
        coach: coachId
      }).sort({
        createdAt: -1
      }).limit(250).lean()]);
      if (Array.isArray(dbEnrollments) && dbEnrollments.length) enrollments = dbEnrollments;
      if (Array.isArray(dbAttendance) && dbAttendance.length) attendance = dbAttendance;
      if (Array.isArray(dbProgress) && dbProgress.length) progress = dbProgress;
    }
  } catch (err) {
    console.warn("getCoachDashboard MongoDB query skipped/failed:", err.message);
  }
  const safeEnrollments = enrollments.length ? enrollments : [{
    _id: "enr_c1",
    status: "active",
    student: {
      name: "Shaik Althaf",
      email: "althafshaik1717@gmail.com",
      studentId: 10001
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    }
  }, {
    _id: "enr_c2",
    status: "active",
    student: {
      name: "Y. V. V. Tirumala Tanay",
      email: "tanay@sportivo.demo",
      studentId: 10002
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    }
  }, {
    _id: "enr_c3",
    status: "active",
    student: {
      name: "Sane Praneeth Kumar Reddy",
      email: "praneeth@sportivo.demo",
      studentId: 10003
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Premium",
      duration: 6
    }
  }, {
    _id: "enr_c4",
    status: "active",
    student: {
      name: "Rohan Verma",
      email: "rohan@sportivo.demo",
      studentId: 10004
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    }
  }, {
    _id: "enr_c5",
    status: "active",
    student: {
      name: "Aryan Sharma",
      email: "aryan@sportivo.demo",
      studentId: 10005
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Basic",
      duration: 1
    }
  }, {
    _id: "enr_c6",
    status: "active",
    student: {
      name: "Dev Patel",
      email: "dev@sportivo.demo",
      studentId: 10006
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    }
  }];
  const present = attendance.filter(item => item.status === "present").length;
  return plain({
    enrollments: safeEnrollments,
    attendance,
    progress,
    summary: {
      assigned: safeEnrollments.length,
      attendanceRate: attendance.length ? Math.round(present / attendance.length * 100) : 88,
      progress: 74,
      todaysAttendance: attendance.length ? attendance.filter(item => new Date(item.date).toDateString() === new Date().toDateString()).length : 5
    },
    configured: true
  });
});
export const getCoachEnrollments = cache(async (coachId, search = "") => {
  try {
    if (process.env.MONGODB_URI && coachId) {
      await connectDB();
      const term = String(search || "").trim();
      const rx = term ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
      const enrollments = await Enrollment.find({
        coach: coachId,
        status: "active",
        ...(rx ? {
          student: {
            $in: await User.find({
              role: "student",
              $or: [{
                name: rx
              }, {
                email: rx
              }]
            }).distinct("_id")
          }
        } : {})
      }).sort({
        createdAt: -1
      }).populate("student", "name email image studentId").populate("sport", "name").populate("membershipPlan", "name duration").lean();
      if (enrollments && enrollments.length) {
        const ids = enrollments.map(item => item._id);
        const studentIds = enrollments.map(item => item.student?._id).filter(Boolean);
        const [attendance, progress] = await Promise.all([Attendance.aggregate([{
          $match: {
            enrollment: {
              $in: ids
            }
          }
        }, {
          $group: {
            _id: "$enrollment",
            sessions: {
              $sum: 1
            },
            present: {
              $sum: {
                $cond: [{
                  $eq: ["$status", "present"]
                }, 1, 0]
              }
            }
          }
        }]), Progress.find({
          student: {
            $in: studentIds
          },
          coach: coachId
        }).sort({
          createdAt: -1
        }).lean()]);
        const attendanceByEnrollment = new Map(attendance.map(item => [String(item._id), item]));
        const progressByStudent = new Map();
        for (const item of progress || []) if (!progressByStudent.has(String(item.student))) progressByStudent.set(String(item.student), item);
        return plain(enrollments.map(enrollment => {
          const counts = attendanceByEnrollment.get(String(enrollment._id));
          return {
            ...enrollment,
            attendanceRate: counts?.sessions ? Math.round(counts.present / counts.sessions * 100) : 0,
            latestProgress: progressByStudent.get(String(enrollment.student?._id)) || null
          };
        }));
      }
    }
  } catch (err) {
    console.warn("getCoachEnrollments DB lookup skipped:", err.message);
  }
  const term = String(search || "").toLowerCase().trim();
  const defaultRoster = [{
    _id: "enr_coach_1",
    status: "active",
    student: {
      _id: "std_1",
      name: "Shaik Althaf",
      email: "althafshaik1717@gmail.com",
      studentId: 10001
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    },
    attendanceRate: 85,
    latestProgress: {
      overallProgress: 70,
      skillLevel: "Intermediate"
    }
  }, {
    _id: "enr_coach_2",
    status: "active",
    student: {
      _id: "std_2",
      name: "Y. V. V. Tirumala Tanay",
      email: "tanay@sportivo.demo",
      studentId: 10002
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    },
    attendanceRate: 90,
    latestProgress: {
      overallProgress: 80,
      skillLevel: "Advanced"
    }
  }, {
    _id: "enr_coach_3",
    status: "active",
    student: {
      _id: "std_3",
      name: "Sane Praneeth Kumar Reddy",
      email: "praneeth@sportivo.demo",
      studentId: 10003
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Premium",
      duration: 6
    },
    attendanceRate: 95,
    latestProgress: {
      overallProgress: 88,
      skillLevel: "Advanced"
    }
  }, {
    _id: "enr_coach_4",
    status: "active",
    student: {
      _id: "std_4",
      name: "Rohan Verma",
      email: "rohan@sportivo.demo",
      studentId: 10004
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    },
    attendanceRate: 80,
    latestProgress: {
      overallProgress: 68,
      skillLevel: "Intermediate"
    }
  }, {
    _id: "enr_coach_5",
    status: "active",
    student: {
      _id: "std_5",
      name: "Aryan Sharma",
      email: "aryan@sportivo.demo",
      studentId: 10005
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Basic",
      duration: 1
    },
    attendanceRate: 85,
    latestProgress: {
      overallProgress: 65,
      skillLevel: "Beginner"
    }
  }, {
    _id: "enr_coach_6",
    status: "active",
    student: {
      _id: "std_6",
      name: "Dev Patel",
      email: "dev@sportivo.demo",
      studentId: 10006
    },
    sport: {
      name: "Cricket"
    },
    membershipPlan: {
      name: "Standard",
      duration: 3
    },
    attendanceRate: 88,
    latestProgress: {
      overallProgress: 75,
      skillLevel: "Intermediate"
    }
  }];
  if (!term) return defaultRoster;
  return defaultRoster.filter(item => item.student?.name?.toLowerCase().includes(term) || item.student?.email?.toLowerCase().includes(term) || String(item.student?.studentId).includes(term));
});
export const getAdminDashboard = cache(async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const attendanceStart = new Date();
      attendanceStart.setDate(attendanceStart.getDate() - 30);
      const [students, coaches, enrollments, active, successfulPayments, attendanceCount, attendance, progress, revenue, sportCounts, attendanceTrends, progressDistribution] = await Promise.all([User.countDocuments({
        role: "student"
      }), User.countDocuments({
        role: "coach"
      }), Enrollment.countDocuments({}), Enrollment.countDocuments({
        status: "active"
      }), Payment.aggregate([{
        $match: {
          status: "successful"
        }
      }, {
        $group: {
          _id: null,
          amount: {
            $sum: "$amount"
          },
          count: {
            $sum: 1
          }
        }
      }]), Attendance.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }), Attendance.find({}).sort({
        date: -1
      }).limit(150).lean(), Progress.find({}).sort({
        createdAt: -1
      }).limit(100).lean(), Payment.aggregate([{
        $match: {
          status: "successful"
        }
      }, {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt"
            }
          },
          amount: {
            $sum: "$amount"
          }
        }
      }, {
        $sort: {
          _id: 1
        }
      }, {
        $limit: 8
      }]), Enrollment.aggregate([{
        $group: {
          _id: "$sport",
          count: {
            $sum: 1
          }
        }
      }, {
        $lookup: {
          from: "sports",
          localField: "_id",
          foreignField: "_id",
          as: "sport"
        }
      }, {
        $unwind: {
          path: "$sport",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $project: {
          name: {
            $ifNull: ["$sport.name", "Other"]
          },
          count: 1
        }
      }]), Attendance.aggregate([{
        $match: {
          date: {
            $gte: attendanceStart
          }
        }
      }, {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date"
            }
          },
          present: {
            $sum: {
              $cond: [{
                $eq: ["$status", "present"]
              }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{
                $eq: ["$status", "absent"]
              }, 1, 0]
            }
          }
        }
      }, {
        $sort: {
          _id: 1
        }
      }, {
        $limit: 14
      }]), Progress.aggregate([{
        $sort: {
          createdAt: -1
        }
      }, {
        $group: {
          _id: "$student",
          level: {
            $first: "$skillLevel"
          },
          score: {
            $first: "$overallProgress"
          }
        }
      }, {
        $group: {
          _id: "$level",
          students: {
            $sum: 1
          },
          average: {
            $avg: "$score"
          }
        }
      }, {
        $project: {
          level: "$_id",
          students: 1,
          average: {
            $round: ["$average", 0]
          }
        }
      }, {
        $sort: {
          level: 1
        }
      }])]);
      if (students > 0 || enrollments > 0) {
        const present = (attendance || []).filter(item => item.status === "present").length;
        const avgProgress = (progress || []).length ? Math.round(progress.reduce((sum, row) => sum + row.overallProgress, 0) / progress.length) : 0;
        return plain({
          stats: [{
            label: "Total students",
            value: students || 0,
            note: "Registered athletes"
          }, {
            label: "Total coaches",
            value: coaches || 0,
            note: "Academy team"
          }, {
            label: "Total enrollments",
            value: enrollments || 0,
            note: "All programmes"
          }, {
            label: "Active memberships",
            value: active || 0,
            note: "Currently training"
          }, {
            label: "Total revenue",
            value: successfulPayments[0]?.amount || 0,
            note: `${successfulPayments[0]?.count || 0} verified payments`,
            currency: true
          }, {
            label: "Today's attendance",
            value: attendanceCount || 0,
            note: "Sessions recorded today"
          }, {
            label: "Average attendance",
            value: attendance?.length ? `${Math.round(present / attendance.length * 100)}%` : "0%",
            note: "Recent sessions"
          }, {
            label: "Average student progress",
            value: `${avgProgress}%`,
            note: "Latest coach reviews"
          }],
          revenue: (revenue || []).map(row => ({
            month: row._id,
            amount: row.amount
          })),
          sports: sportCounts || [],
          attendance: (attendanceTrends || []).map(row => ({
            date: row._id,
            present: row.present,
            absent: row.absent
          })),
          progress: (progress || []).slice(0, 12).map(row => ({
            level: row.skillLevel,
            score: row.overallProgress
          })),
          progressDistribution: progressDistribution || [],
          configured: true
        });
      }
    }
  } catch (err) {
    console.warn("getAdminDashboard DB lookup skipped:", err.message);
  }
  return {
    stats: [{
      label: "Total students",
      value: 42,
      note: "Registered athletes"
    }, {
      label: "Total coaches",
      value: 6,
      note: "Academy team"
    }, {
      label: "Total enrollments",
      value: 38,
      note: "All programmes"
    }, {
      label: "Active memberships",
      value: 35,
      note: "Currently training"
    }, {
      label: "Total revenue",
      value: 142500,
      note: "Verified payments",
      currency: true
    }, {
      label: "Today's attendance",
      value: 18,
      note: "Sessions recorded today"
    }, {
      label: "Average attendance",
      value: "88%",
      note: "Recent sessions"
    }, {
      label: "Average student progress",
      value: "74%",
      note: "Latest coach reviews"
    }],
    revenue: [{
      month: "2026-06",
      amount: 18000
    }, {
      month: "2026-07",
      amount: 22500
    }, {
      month: "2026-08",
      amount: 29000
    }, {
      month: "2026-09",
      amount: 35000
    }, {
      month: "2026-10",
      amount: 38000
    }],
    sports: [{
      name: "Cricket",
      count: 18
    }, {
      name: "Football",
      count: 14
    }, {
      name: "Basketball",
      count: 10
    }],
    attendance: [{
      date: "Day 1",
      present: 16,
      absent: 2
    }, {
      date: "Day 2",
      present: 17,
      absent: 1
    }, {
      date: "Day 3",
      present: 15,
      absent: 3
    }, {
      date: "Day 4",
      present: 18,
      absent: 0
    }],
    progress: [],
    progressDistribution: [{
      level: "Beginner",
      students: 12,
      average: 65
    }, {
      level: "Intermediate",
      students: 18,
      average: 78
    }, {
      level: "Advanced",
      students: 8,
      average: 88
    }, {
      level: "Professional",
      students: 4,
      average: 95
    }],
    configured: true
  };
});
export const getAdminRecords = cache(async (resource, search = "") => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      const term = String(search || "").trim();
      const rx = term ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
      if (resource === "students") {
        const users = await User.find({
          role: "student",
          ...(rx ? {
            $or: [{
              name: rx
            }, {
              email: rx
            }]
          } : {})
        }).sort({
          createdAt: -1
        }).limit(200).lean();
        const enrollments = await Enrollment.find({
          student: {
            $in: users.map(user => user._id)
          },
          status: "active"
        }).sort({
          createdAt: -1
        }).populate("sport", "name").populate("membershipPlan", "name").populate("coach", "name").lean();
        const current = new Map();
        for (const enrollment of enrollments) if (!current.has(String(enrollment.student))) current.set(String(enrollment.student), enrollment);
        if (users.length) return plain(users.map(user => ({
          ...user,
          enrollment: current.get(String(user._id)) || null
        })));
      }
      if (resource === "coaches") {
        const coaches = await Coach.find({}).sort({
          createdAt: -1
        }).populate("user", "name email phone isActive").populate("sports", "name").lean();
        if (coaches.length) return plain(coaches);
      }
      if (resource === "sports") {
        const sports = await Sport.find({}).sort({
          name: 1
        }).lean();
        if (sports.length) return plain(sports);
      }
      if (resource === "membership") {
        const plans = await MembershipPlan.find({}).populate("sport", "name").sort({
          price: 1
        }).lean();
        if (plans.length) return plain(plans);
      }
      if (resource === "enrollments") {
        const enrollments = await Enrollment.find({}).sort({
          createdAt: -1
        }).limit(200).populate("student", "name email").populate("coach", "name").populate("sport", "name").populate("membershipPlan", "name price").lean();
        if (enrollments.length) return plain(enrollments);
      }
      if (resource === "attendance") {
        const att = await Attendance.find({}).sort({
          date: -1
        }).limit(200).populate("student", "name").populate("coach", "name").populate("sport", "name").lean();
        if (att.length) return plain(att);
      }
      if (resource === "progress") {
        const prg = await Progress.find({}).sort({
          createdAt: -1
        }).limit(200).populate("student", "name").populate("coach", "name").populate("sport", "name").lean();
        if (prg.length) return plain(prg);
      }
      if (resource === "payments") {
        const pay = await Payment.find({}).sort({
          createdAt: -1
        }).limit(200).populate("student", "name email").populate("membershipPlan", "name").lean();
        if (pay.length) return plain(pay);
      }
      if (resource === "users") {
        const users = await User.find({
          ...(rx ? {
            $or: [{
              name: rx
            }, {
              email: rx
            }]
          } : {})
        }).sort({
          createdAt: -1
        }).limit(200).lean();
        if (users.length) return plain(users);
      }
    }
  } catch (err) {
    console.warn("getAdminRecords fallback for:", resource, err.message);
  }
  if (resource === "sports") return sportsCatalog;
  if (resource === "coaches") return coachesCatalog;
  if (resource === "membership") return planCatalog;
  if (resource === "students") {
    return [{
      _id: "s1",
      name: "Shaik Althaf",
      email: "althafshaik1717@gmail.com",
      studentId: 10001,
      enrollment: {
        sport: {
          name: "Cricket"
        },
        membershipPlan: {
          name: "Standard"
        }
      }
    }, {
      _id: "s2",
      name: "Y. V. V. Tirumala Tanay",
      email: "tanay@sportivo.demo",
      studentId: 10002,
      enrollment: {
        sport: {
          name: "Cricket"
        },
        membershipPlan: {
          name: "Standard"
        }
      }
    }, {
      _id: "s3",
      name: "Sane Praneeth Kumar Reddy",
      email: "praneeth@sportivo.demo",
      studentId: 10003,
      enrollment: {
        sport: {
          name: "Cricket"
        },
        membershipPlan: {
          name: "Premium"
        }
      }
    }, {
      _id: "s4",
      name: "Rohan Verma",
      email: "rohan@sportivo.demo",
      studentId: 10004,
      enrollment: {
        sport: {
          name: "Football"
        },
        membershipPlan: {
          name: "Standard"
        }
      }
    }, {
      _id: "s5",
      name: "Aryan Sharma",
      email: "aryan@sportivo.demo",
      studentId: 10005,
      enrollment: {
        sport: {
          name: "Basketball"
        },
        membershipPlan: {
          name: "Basic"
        }
      }
    }];
  }
  if (resource === "payments") {
    return [{
      _id: "p1",
      student: {
        name: "Shaik Althaf",
        email: "althafshaik1717@gmail.com"
      },
      membershipPlan: {
        name: "Standard"
      },
      amount: 3999,
      status: "successful",
      createdAt: new Date()
    }, {
      _id: "p2",
      student: {
        name: "Y. V. V. Tirumala Tanay",
        email: "tanay@sportivo.demo"
      },
      membershipPlan: {
        name: "Standard"
      },
      amount: 3999,
      status: "successful",
      createdAt: new Date(Date.now() - 86400000)
    }, {
      _id: "p3",
      student: {
        name: "Sane Praneeth Kumar Reddy",
        email: "praneeth@sportivo.demo"
      },
      membershipPlan: {
        name: "Premium"
      },
      amount: 6999,
      status: "successful",
      createdAt: new Date(Date.now() - 2 * 86400000)
    }];
  }
  if (resource === "enrollments") {
    return [{
      _id: "e1",
      student: {
        name: "Shaik Althaf",
        email: "althafshaik1717@gmail.com"
      },
      sport: {
        name: "Cricket"
      },
      coach: {
        name: "Coach Arjun Menon"
      },
      membershipPlan: {
        name: "Standard",
        price: 3999
      },
      status: "active",
      createdAt: new Date()
    }, {
      _id: "e2",
      student: {
        name: "Y. V. V. Tirumala Tanay",
        email: "tanay@sportivo.demo"
      },
      sport: {
        name: "Cricket"
      },
      coach: {
        name: "Coach Arjun Menon"
      },
      membershipPlan: {
        name: "Standard",
        price: 3999
      },
      status: "active",
      createdAt: new Date(Date.now() - 86400000)
    }, {
      _id: "e3",
      student: {
        name: "Sane Praneeth Kumar Reddy",
        email: "praneeth@sportivo.demo"
      },
      sport: {
        name: "Cricket"
      },
      coach: {
        name: "Coach Arjun Menon"
      },
      membershipPlan: {
        name: "Premium",
        price: 6999
      },
      status: "active",
      createdAt: new Date(Date.now() - 2 * 86400000)
    }];
  }
  return [];
});
