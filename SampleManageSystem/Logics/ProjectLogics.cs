﻿using DataAccess;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logics
{
    public class ProjectLogics : BaseLogics<Project>
    {
        private const string _Type = "ProjectAccess";
        private IDataAccess.IProjectAccess _Dal;

        public ProjectLogics(): base(_Type)
        {
            _Dal = base.dal as IDataAccess.IProjectAccess;

            if (_Dal == null)
            {
                throw new NullReferenceException(_Type);
            }
        }
        public IList<Project> GetUProjectListByUser(int systemuserId, int roleId, int page)
        {
            if (roleId == 6||roleId==18)
            {
               return _Dal.GetUProjectList(page);
            }else if(roleId==2){
                return _Dal.GetUProjectListByEnginnerId(systemuserId, page);
            }
            else if(roleId==3)
            {
                return _Dal.GetUProjectListByTesterId(systemuserId,page);
            }
            else
            {
                IList<Project> projectList = null;
                return projectList;
            }
           
        }

        public IList<Project> GetNotFinishedProjectList()
        {
            return _Dal.GetNotFinishedProjectList();
        }

        public IList<Project> GetProjectListByUserId(int systemuserId,int roleId,int Page,int statusCode)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetAllProjectList(Page);
            }
           else if (roleId == 2)
            {
                return _Dal.GetProjectListByEngineerId(systemuserId,Page);
            }
            else if(roleId==3)
            {
                return _Dal.GetProjectListByTesterId(systemuserId,Page);
            }
            return new List<Project>();
        }
  
        public IList<Project> GetProjectList()
        {
            return _Dal.GetProjectList();
        }
        public Project GetProject(int projectId)
        {
            return _Dal.GetModel(projectId);
        }
        public bool UpdateStatus(int projectId, int status)
        {
            return _Dal.UpdateStatus(projectId, status);
        }
        public bool DeleteProject(int projectId)
        {
            if (_Dal.ExistTask(projectId))
            {
                return false;
            }
            else
            {
                return _Dal.Delete(projectId);
            }
         
        }
        public int CreateProject(Project project)
        {
            int projectId = _Dal.CreateProject(project);
            ProjectTemplateLogics projectTemplateLogics = new ProjectTemplateLogics();
            TaskLogics taskLogics = new TaskLogics();

            IList<ProjectTemplate> projectTemplateList = projectTemplateLogics.GetProjectTemplateList();

            foreach (ProjectTemplate template in projectTemplateList)
            {
                Model.Task task = new Model.Task();
                task.Name = template.TaskName;
                task.RoomId = template.RoomId;
                task.ProjectId = projectId;
                task.Description = template.Description;
                task.CreatedBy = project.CreatedBy;
               
                taskLogics.CreateTask(task);
            }
            return projectId;
        }
        public bool ArchiveProject(int projectId, int modifiedBy)
        {
            
            //释放周转箱任务
            ContainerAccess containerAccess = new ContainerAccess();
            SampleAccess sampleAccess = new SampleAccess();
            sampleAccess.ReleaseContainerSampleByProjectId(projectId);
            containerAccess.ReleaseContainerTaskByProjectId(projectId);
            containerAccess.ReleaseContainer(projectId);
            //归还周转箱,设置周转箱所属项目为空
           // IList<Container> containerList = _Dal.UpdateContainerProjectId(projectId, modifiedBy);

            //清理周转箱下样品，设置项目下样品所属周转箱为空
            //_Dal.UpdateSampleContainer(projectId, modifiedBy);

            return _Dal.UpdateProjectStatusCode(projectId, modifiedBy);
            
        }
        public IList<Project> GetProjectListByStatus()
        {
            return _Dal.GetProjectListByStatus();
        }
        public long GetUProjectCount(int systemuserId,int roleId)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetAllUProjectCount();
            }else if(roleId==2){
                return _Dal.GetUProjectCountByEngineer(systemuserId);
            }
            else
            {
                return _Dal.GetUProjectByTaksTester(systemuserId);
            }
        }
         public IList<Project> GetDelayProjectList(int systemuserId,int roleId,int Page,int Limit)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetALLDelayProject(Page,Limit);
            }else if (roleId == 2)
            {
                return _Dal.GetDelayProjectByEngineerId(systemuserId,Page,Limit);
            }else if (roleId == 3)
            {
                return _Dal.GetDelayProjectByTester(systemuserId,Page,Limit);
            }
            else
            {
                IList<Project> projectList = new List<Project>();
                return projectList;
            }
        }
        public long GetDelayProjectCount(int systemuserId, int roleId)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetDelayProjectCount();
            }
            else if (roleId == 2)
            {
                return _Dal.GetDelayProjectCountByEngineerId(systemuserId);
            }
            else if (roleId == 3)
            {
                return _Dal.GetDelayProjectCountByTesterId(systemuserId);
            }
            else
            {
                var a = 0;
                return a;
            }

        }
        public long GetProjectCount(int systemuserId,int roleId,int statusCode)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetAllProjectCount();
            }
            else if (roleId == 2)
            {
                return _Dal.GetProjectCountByEngineer(systemuserId);
            }
            else if (roleId == 3)
            {
                return _Dal.GetProjectByTaksTester(systemuserId);
            }
            else
            {
                var a = 0;
                return a;
            }
        }
        public IList<Project> GetFinishProjectList(int Page,int systemuserId,int roleId)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetAllFinishProjectList(Page);
            }else if (roleId == 2)
            {
                return _Dal.GetFinishProjectListByEngineerId(Page, systemuserId);
            }else if (roleId == 3)
            {
                return _Dal.GetFinishProjectListByTseterId(Page, systemuserId);
            }
            else
            {
                IList<Project> projectList = new List<Project>();
                return projectList;
            }
        }
        public long GetFinishProjectCount(int systemuserId, int roleId)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetFinishProjectCount();
            }else if (roleId == 2)
            {
                return _Dal.GetFinishProjectCountByEngineerId(systemuserId);
            }else if (roleId == 3)
            {
                return _Dal.GetFinishProjectCountByTesterId(systemuserId);
            }
            else
            {
                var a = 0;
                return a;
            }

        }
        public IList<Project> GetProjectStatusCodeList(int systemuserId,int roleId,int Page, int statusCode)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetProjectStatusCodeList(Page, statusCode);
            }else if (roleId == 2)
            {
                return _Dal.GetProjectStatusCodeListByEngineerId(systemuserId,Page, statusCode);
            }else if (roleId == 3)
            {
                return _Dal.GetProjectStatusCodeListByTesterId(systemuserId,Page, statusCode);
            }
            else
            {
                IList<Project> projectList = new List<Project>();
                return projectList;
            }
        }

        public void Release()
        {
 
        }

        public long GetProjectStatusCodeCount(int systemuserId, int roleId, int statusCode)
        {
            if (roleId == 6||roleId==18)
            {
                return _Dal.GetProjectStatusCodeCount(statusCode);
            }else if (roleId == 2)
            {
                return _Dal.GetProjectStatusCodeCountByEngineerId(systemuserId, statusCode);
            }else if (roleId == 3)
            {
                return _Dal.GetProjectStatusCodeCountByTesterId(systemuserId, statusCode);
            }
            else
            {
                var a = 0;
                return a;
            }
        }
        public bool UpdateProjectStarttime(int projectId, DateTime startTime, int systemuserId)
        {
            return _Dal.UpdateProjectStarttime(projectId, startTime, systemuserId);
        }
        public bool UpdateProjectEndtime(int projectId,DateTime endTime, int systemuserId)
        {
            return _Dal.UpdateProjectEndtime(projectId, endTime, systemuserId);
        }
        public IList<Project> GetProjectIdList(int roleId,int systemuserId)
        {
            if (roleId == 6 || roleId == 18)
            {
                return _Dal.GetProjectIdList();
            }else if (roleId == 2)
            {
                return _Dal.GetProjectIdListByEngineerId(systemuserId);
            }else if (roleId == 3)
            {
                return _Dal.GetProjectIdListByTesterId(systemuserId);
            }
            else
            {
                IList<Project> projectList = new List<Project>();
                return projectList;
            }
        }
    }
}
